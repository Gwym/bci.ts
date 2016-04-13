"use strict";
var http = require("http");
var ws = require("ws");
var commons_1 = require("./commons");
var obciserial_1 = require("./modules/obciserial");
var filepersistor_1 = require("./modules/filepersistor");
var FileServer = require('node-static');
var WebSocketServer = ws.Server;
const env = {
    protocol: 'eg001',
    ipaddress: "127.0.0.1",
    port: 8080
};
var broadcast;
broadcast = function (message) {
    for (var i = 0; i < wss.clients.length; i++) {
        if (wss.clients[i].readyState === ws.OPEN) {
            wss.clients[i].send(JSON.stringify(message));
        }
        else {
            console.warn('client ' + i + ' is not open, discarding message.');
        }
    }
};
var dispatcher = broadcast;
var serial = new obciserial_1.ObciSerial('serial', {}, dispatcher);
var persistor = new filepersistor_1.Persistor.FilePersistor();
var file = new FileServer.Server('./webapp', { indexFile: "index.html", cache: false });
console.log('serving ' + file.root);
var logger = {
    info: function (s) {
        console.log(s);
    },
    error: function (err) {
        console.error(err);
    }
};
class User {
}
var users = {
    find: function (id) {
        return new User();
    }
};
var server = http.createServer((req, res) => {
    req.headers.url = req.url;
    req.headers.ip = req.socket.remoteAddress;
    req.addListener('end', function () {
        file.serve(req, res, function (err, result) {
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
var wss = new WebSocketServer({ server: server, clientTracking: true }, function () {
    console.log('WS > listen callback ');
});
var ws_connection_counter = 0;
wss.on('connection', function (ws) {
    console.log('protocol: ' + ws.protocol + ' protocolVersion:' + ws.protocolVersion);
    if (ws.protocol !== env.protocol) {
        console.log('WS > bad protocol, closing ' + ws.protocol + ' ' + env.protocol);
        ws.close(1000, 'PROTOCOL ERROR ' + ws.protocol);
        return;
    }
    console.log('WS connection > clients# ' + wss.clients.length + ' ws_connection_counter:' + ws_connection_counter);
    ws.ID = ws_connection_counter++;
    ws.on('close', function () {
        console.log('WS > close  ' + ws.userID);
    });
    ws.on('message', function (message, flags) {
        try {
            var m = JSON.parse(message);
            if (m.target === commons_1.BlocksTypes.Serial) {
                serial.handler(m);
            }
            else if (m.target === commons_1.BlocksTypes.Persistor) {
                persistor.handler(m);
            }
            else {
                console.error('invalid target ' + m.target);
            }
        }
        catch (e) {
            console.log('WS > error ' + e + ', closing ' + ws.ID);
            console.log(message.data);
            ws.close(1000, 'JSON ERROR OR DISPATCHING ERROR');
            throw e;
        }
    });
});
var replyAsync = function (wsID, message) {
    console.log('replyAsync to ' + wsID);
    var ws;
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
};
//# sourceMappingURL=app.js.map