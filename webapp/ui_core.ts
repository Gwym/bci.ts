"use strict"

/// <reference path="common.ts" />
/// <reference path="./i18n.ts" />

const env = {
  // protocol: 'eg001', // set in worker
  websocketPath: 'ws://127.0.0.1:8080/'
}

var worker: Worker

module Core {
  export class System {

    private anim_frame_request_id: number;
    private redrawers: { (): void; }[] = [];
 
    registerAnim(redrawer: () => void) {

      this.redrawers.push(redrawer);

      /* var step = (timestamp: number) => {

        for (var r in this.redrawers) {
          this.redrawers[r]();
        }

        this.anim_frame_request_id = requestAnimationFrame(step);
      } */

      if (this.anim_frame_request_id === undefined)
        this.anim_frame_request_id = requestAnimationFrame(this.step);
    }

    unregisterAnim(redrawer: () => void) {

      for (var i = 0; i < this.redrawers.length; i++) {
        if (redrawer === this.redrawers[i]) {
          this.redrawers.splice(i, 1);
          break;
        }
      }

      if (this.redrawers.length === 0) {
        cancelAnimationFrame(this.anim_frame_request_id);
        this.anim_frame_request_id = undefined;
      }
    }
    
    step = (timestamp: number) => {

      for (var r in this.redrawers) {
        this.redrawers[r]();
      }

      this.anim_frame_request_id = requestAnimationFrame(this.step);
    }
  }
}

var system = new Core.System();
var appTitle = document.title;

var text_console: HTMLTextAreaElement

var log: (s: string) => void

window.addEventListener('load', function() {

  text_console = <HTMLTextAreaElement>document.getElementById('text_console');
  text_console.addEventListener('dblclick', function(e) { text_console.value = '' });

  log = function(s) { var d = new Date(); text_console.value = d.toLocaleTimeString() + ':' + d.getMilliseconds() + ' > ' + s + '\n' + text_console.value; };

  // TODO (4) : element.requestFullscreen

  // init
  var serial = new UiSerial(BlocksTypes.Serial, {});  // TODO (2) : container from configuration/options
  var persistor = new UiPersistor(BlocksTypes.Persistor, {});
  Ui.setStateDisconnected();

  // toggle canvas visibility
  var canvas_state_button = document.getElementById('canvas-state');
  canvas_state_button.onclick = function() {
    var canvas_container = document.getElementById('canvas_container');
    if (canvas_container.style.display === 'none') {
      canvas_container.style.display = 'block';
      canvas_state_button.textContent = i18n.hide_canvas;
    }
    else {
      canvas_container.style.display = 'none';
      canvas_state_button.textContent = i18n.show_canvas;
    }
  }
  canvas_state_button.textContent = i18n.hide_canvas;

  var path = env.websocketPath;

  log('Connecting websocket ' + path);
  worker = new Worker(window.URL.createObjectURL(new Blob([document.getElementById('bci_worker').textContent], { type: "text/javascript" })));

  worker.onerror = function(e: ErrorEvent) {
    console.error(e);
  }

  worker.onmessage = function(e: MessageEvent) {

    var message: WebsocketMessage = e.data;
 
    if (message.messageType === MessageTypes.Error) { // TODO (3) : MessageTypes.SystemError ?
      log('websocket error ' + e);
      console.error(message.data);
    }
    
    if (message.websocketLog) {
      log('websocket > ' + message.websocketLog);
      return;
    }
    
    if (message.target === BlocksTypes.Serial) {
        // console.log('dispatch target:' + message.target + ' (serial) messageType:' + message.messageType + ' data:' + message.data );
        serial.handler(message);
    }
    else if (message.target === BlocksTypes.Persistor) {
        // console.log('dispatch target:' + message.target + ' (persistor) messageType:' + message.messageType + ' data:' + message.data );
        persistor.handler(message);
    }
    else if (message.target === BlocksTypes.Worker) {

      if (message.messageType === MessageTypes.WebsocketClose) {
        log('websocket close code:' + message.data.code + ' reason:' + message.data.reason);

        worker.terminate();
        Ui.setStateDisconnected();

        Ui.hidePanel(); // TODO (0) : arg :worker.ID -> server
      }
      else if (message.messageType === MessageTypes.WebsocketCreate) {
        Ui.setStateConnected();
        // request for server'blocks states
        worker.postMessage(<WebsocketMessage> { target: BlocksTypes.Serial, messageType: MessageTypes.RequestState, data: {} } ); 
        worker.postMessage(<WebsocketMessage> { target: BlocksTypes.Persistor, messageType: MessageTypes.RequestState, data: {} } );
      }
      else {
        console.error(new Error('UnknowMessageType ' + message.messageType));
      }
    }
    else { console.error('dispatch > Invalid websocketMessage :'); console.log(message); }
  } // end worker.onmessage

  worker.postMessage(<WebsocketMessage> { target: BlocksTypes.Worker, messageType: MessageTypes.WebsocketCreate, data: { path: path } } );
});



module Ui {

  export function setStateConnected() {
    document.title = appTitle + ' - ' + env.websocketPath;
  }

  export function setStateDisconnected() {
    document.title = appTitle + ' - ' + i18n.disconnected;
  }

  export function showAuthModal() {

    function listener() {
      worker.postMessage({ // TODO (4) : WebsocketMessage
        action: 'send',
        data: {
          id: (<HTMLInputElement>document.getElementById('user-id')).value,
          pwd: (<HTMLInputElement>document.getElementById('user-pwd')).value
        }
      });
      (<HTMLFormElement>document.getElementById('form-auth')).removeEventListener('submit', listener);
      document.getElementById('panel-auth').style.display = 'none'; // hide
      return false;
    }

    document.getElementById('form-auth').addEventListener('submit', listener);
    document.getElementById('panel-auth').style.display = 'block'; // show
  }

  export function hidePanel() {
    // TODO (0) : only delete id specific
    var e = document.getElementById('blocks-control');
    while (e.firstChild) {
      e.removeChild(e.firstChild);
    }
  }
}