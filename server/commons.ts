// !!! WARNING : enum type Worker === 0 is used raw in index.html !!!
export enum BlocksTypes { Worker, Serial, Persistor, Audio, Image, Video };

// StateEvent

interface SeEvent {
  
}

export interface StateEventMachine {
  state: number,
  event: (e: SeEvent) => void;
  setTimer: (e: SeEvent, duration: number) => void;
  clearTimer: (e: SeEvent) => void
}


// Communication
// !!! WARNING : enum type WebsocketCreate === 0 and WebsocketClose === 1 are used raw in index.html !!!
export enum MessageTypes { WebsocketCreate, WebsocketClose, RequestState, State, Control, Data, Error, RequestPorts };

export interface MessageConsumer {
    handler: (message: any) => void; // local message type (WebsocketMessage.data)
}


// TODO (2) : one interface per message type ?

export interface WebsocketMessage {

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
    ports?: string[], // MessageTypes.RequestPorts 
    error?: string // MessageTypes.Error
  };
}

// Acquisition

// !!! WARNING : enum type SerialStates is used in i18n and in css for state styling !!!
export enum SerialStates { Closed, Opening, WaitingForBoard, Idle, Streaming, WaitEnding };
// TODO (3) : separate public and private events
export enum SerialEvents { Open, Close, GetPut, StreamStart, StreamStop, OnOpen, OnControl, OnEndOfSection, WriteNext, Error, Timeout};
export enum SerialControls { };

export interface ISerialOptions {
  port?: string;
  baudrate?: number;
  logControl?: boolean;
  useSimulator?: boolean;
}

// Storage

// !!! WARNING : enum type PersistorStates is used in i18n and in css for state styling !!!
export enum PersistorStates { Init, Closed, Opening, Idle, Streaming};
export enum PersistorEvents { Open, OnOpen, Close, Error, Timeout, StreamStart, StreamStop, Control };
export enum PersistorControls { }



