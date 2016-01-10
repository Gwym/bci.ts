// node.js server for bci.ts (brain controller interface in TypeScript)

"use strict"

import * as fs from "fs";
import * as http from "http";
import * as url from "url";
import * as ws from "ws";

import {WebsocketMessage, BlocksTypes} from "./commons";
import * as Obci from "./modules/obciserial";
import {ObciSerial} from "./modules/obciserial";
import {Persistor} from "./modules/filepersistor";

var FileServer = require('node-static');

var WebSocketServer = ws.Server;

//  set environment variables
const env = {
  protocol: 'eg001',
  ipaddress: "127.0.0.1",
  port: 8080
};

var broadcast: Obci.IDispatcher;
broadcast = function(message) {

  for (var i = 0; i < wss.clients.length; i++) {
    if (wss.clients[i].readyState === ws.OPEN) {
      wss.clients[i].send(JSON.stringify(message));
    }
    else {
      console.warn('client ' + i + ' is not open, discarding message.');
    }
  }
}

var dispatcher = broadcast; // TODO (2) : dispatcher, connection selection, authorization

var serial = new ObciSerial('serial', {}, dispatcher); 
var persistor = new Persistor.FilePersistor();

// index page

// var html = fs.readFileSync("./build/index.html");
var file = new FileServer.Server('./webapp', { indexFile: "index.html", cache: false }); // set cache: false is for debugging purpose

console.log('serving ' + file.root);

// TODO (2) : fileLogger
var logger = {
  info: function(s: string) {
    console.log(s);
  },
  error: function(err: string) {
    console.error(err);
  }
}

// persistence (todo)

class User {
  password_hash: string;
  id: number;
}

var users = {
  find: function(id: { login: string }): User {
    return new User();
  }
}

var server = http.createServer((req, res) => {

  req.headers.url = req.url;
  req.headers.ip = req.connection.remoteAddress;

 // logger.info(req.headers);
   
  // res.writeHead(200, { 'Content-Type': 'text/html' });
  // res.end(html);
  
  req.addListener('end', function() {
    file.serve(req, res, function(err: any, result: any) {
      if (err) {
        console.log(err);
        console.log(result);
        logger.error(err);
        res.writeHead(err.status, err.headers);
        res.end('<!DOCTYPE html><html><head><head><body>404 : Brain not found.</body></html>');
      }
    });
  }).resume();

}).listen(env.port, env.ipaddress);

console.log('%s: Node server started on %s:%d', Date(), env.ipaddress, env.port);
	

// test
/*
import {SerialEvents} from "./commons"

var test = function() {
  console.log('test');
  serial.handler({event: SerialEvents.Init });
}

setTimeout(test, 2000);
*/

var wss = new WebSocketServer(
  { server: server, clientTracking: true }, // TODO (2) : verifyClient
  function() {
    console.log('WS > listen callback ');
  });

var ws_connection_counter = 0; // TODO (2) : nodeObserver

wss.on('connection', function(ws) {

  if (ws.protocol !== env.protocol) {
    console.log('WS > bad protocol, closing ' + ws.protocol + ' ' + env.protocol);

    ws.close(1000, 'PROTOCOL ERROR ' + ws.protocol );
    return;
  }

  //console.log('WS > connection ' + toStr(ws) );
  console.log('WS connection > clients# ' + wss.clients.length + ' ws_connection_counter:' + ws_connection_counter);
  ws.ID = ws_connection_counter++;

  ws.on('close', function() {
    console.log('WS > close  ' + ws.userID);
  });

  ws.on('message', function(message, flags) { 

    // TODO (2) : if (flags.binary) (message instanceof ArrayBuffer && ws.raw_dispatcher) { ws.raw_dispatcher(message) }  // incoming data, destination previously defined
    // else
    try {

      var m: WebsocketMessage = JSON.parse(message);
      
      // console.log('WS > received: %s on userID: %s', message, ws.ID + ' target:' + typeof m.target);

      // if (m.websocketId) { console.warn('overwriting message.origin'); }
      // m.websocketId = ws.ID;
      
      if (m.target === BlocksTypes.Serial) {
        serial.handler(m);
      }
      else if (m.target === BlocksTypes.Persistor) {
        persistor.handler(m);
      }
      else {
        console.error('invalid target ' + m.target);
      }
    }
    catch (e) {
      console.log('WS > error ' + e + ', closing ' + ws.ID);
      console.log(message.data);
      throw e; // console.error(e);
      ws.close(1000, 'JSON ERROR OR DISPATCHING ERROR'); // TODO (3) : separate JSON and DISPATCHING exceptions
    }

  });

  // ws.onopen
  // ws.onerror
  // ws.onclose

});

var replyAsync = function(wsID: number, message: WebsocketMessage) {

  console.log('replyAsync to ' + wsID);

  var ws: ws;

  for (var i = 0; i < wss.clients.length; i++) {
    if (wss.clients[i].ID === wsID) {
      ws = wss.clients[i];
    }
  }

  if (ws) {
    ws.send(JSON.stringify(message));
  }
  else {
    console.warn('no socket ' + wsID + ' for message ' + JSON.stringify(message));
  }
}
