// WARNING : GENERATED FILE, DO NOT MODIFY (modifiy server/commons.ts 
// and run node build/common_tr.js

// !!! WARNING : enum type Worker === 0 is used raw in index.html !!!
enum BlocksTypes { Worker, Serial, Persistor, Audio, Image, Video };

// StateEvent

interface SeEvent {
  
}

interface StateEventMachine {
  state: number,
  event: (e: SeEvent) => void;
  setTimer: (e: SeEvent, duration: number) => void;
  clearTimer: (e: SeEvent) => void
}


// Communication
// !!! WARNING : enum type WebsocketCreate === 0 and WebsocketClose === 1 are used raw in index.html !!!
enum MessageTypes { WebsocketCreate, WebsocketClose, RequestState, State, Control, Data, Error };

interface MessageConsumer {
    handler: (message: any) => void; // local message type (WebsocketMessage.data)
}


// TODO (2) : one interface per message type ?

interface WebsocketMessage {

  websocketLog?: string; // websocket/worker debug
   
  target: BlocksTypes;
  messageType: MessageTypes;
  
  event?: number; // MessageTypes.Control
  data: {
    path?: string,  // MessageTypes.WebsocketCreate
    code?: number,  reason?: string, // MessageTypes.WebsocketClose
    state?: number // MessageTypes.State
    samples?: number[], accel?: number[], count?: number, // MessageTypes.Data
    control?: string, connect_to_ws?: boolean, // MessageTypes.Control 
    error?: string // MessageTypes.Error
  };
}

// Acquisition

// !!! WARNING : enum type SerialStates is used in i18n and in css for state styling !!!
enum SerialStates { Closed, Opening, WaitingForBoard, Idle, Streaming, WaitEnding };
// TODO (3) : separate public and private events
enum SerialEvents { Open, Close, GetPut, StreamStart, StreamStop, OnOpen, OnControl, OnEndOfSection, WriteNext, Error, Timeout};
enum SerialControls { };

// Storage

// !!! WARNING : enum type PersistorStates is used in i18n and in css for state styling !!!
enum PersistorStates { Init, Closed, Opening, Idle, Streaming};
enum PersistorEvents { Open, OnOpen, Close, Error, Timeout, StreamStart, StreamStop, Control };
enum PersistorControls { }



