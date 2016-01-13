// module obci serial

"use strict"

import * as fs from "fs";
import * as sp from "serialport";
import * as spSimu from "../../tests/serialsimu"
import {StateEventMachine, SerialStates, SerialEvents, MessageConsumer, WebsocketMessage, MessageTypes, BlocksTypes, ISerialOptions} from "../commons"

export interface IDispatcher {
		(arg: WebsocketMessage): void;
}

interface EventTable {
  [index: string]: (arg: any) => SerialStates;
}

interface StateTable {
  [index: string]: EventTable; // EventTable
}

export class ObciSerial implements MessageConsumer {

  static LIMIT = 512;
  static FRAME_LENGTH = 33;
  static END_OFFSET = ObciSerial.FRAME_LENGTH - 2; // -1 because START is shifted and -1 (zero indexed)

  private id: BlocksTypes;
  public parse_control = false;
  public parse_frame = false;

  private serialPort: sp.SerialPort;
  private dispatcher: IDispatcher;

  private buf: number[] = [];
  private samples: number[] = [];
  private accel: number[] = [];
  private frame_count = 0;
  private timestamp_start: number[];

  private log_control = false;

  constructor(identifier: string, options: ISerialOptions, disp: IDispatcher) {

    this.id = BlocksTypes.Serial;

    this.dispatcher = disp;

    this.timestamp_start = process.hrtime();
  }

  handler(message: WebsocketMessage) {

    if (message.messageType === MessageTypes.RequestState) {
      this.dispatcher({ target: this.id, messageType: MessageTypes.State, data: { state: this.state } })
    }
    else if (message.messageType === MessageTypes.Control) {

      if (typeof (message.event) !== 'number') {
        console.warn('handler > no Event');
      }

      this.event(message.event, message.data);
    }
    else {
      console.error(new Error('UnknownMessageType'));
    }
  }

  private parser(emitter: any, buffer: number[]): void {

    // TODO (2) : send timings informations to client and store to file
    // var timestamp_step = process.hrtime(this.timestamp_start);
    this.timestamp_start = process.hrtime();
    // console.log(timestamp_step + ' obci_parser > len:' + buffer.length + ' parse_control:' + this.parse_control + ' parse_frame:' + this.parse_frame);

    if (this.parse_control) {

      this.event(SerialEvents.OnControl, buffer.toString());

      if (this.log_control) {
        var date = new Date();
        //console.log(d.toLocaleTimeString() + ':' + d.getMilliseconds() + ' > event:' + e + ' data: ' + (typeof data === 'string' ? data.replace(/\r/gm,'\\r').replace(/\n/gm,'\\n') : data));
        this.log_stream.write(date.toLocaleTimeString() + ':' + date.getMilliseconds() + ' < ' + buffer.toString().replace(/\r/gm, '\\r').replace(/\n/gm, '\\n') + '\r\n');
        // log_stream.write(process.hrtime() + buffer.toString() + '\r\n');
        // log_stream.write(buffer.toString());
        // log_stream.write(buffer.toJSON());
      }
      
      // TODO (3) : this.event(SerialEvents.OnEndOfSection) : here or from client-side parsing ?
    }

    if (this.parse_frame) {

      var i: number;

      for (i = 0; i < buffer.length; i++) {
        this.buf.push(buffer[i]);
      }

      if (this.buf.length > ObciSerial.LIMIT) {
        // this.postMessage({error: 'No frame decoded, discarding whole buffer.', length: buf.length });
        console.log("{error: 'No frame decoded, discarding whole buffer.', length: buf.length }");
        this.buf = [];
        return;
      }

      var current_byte: number, current_frame_counter: number, d: number[], j: number;

      while (this.buf.length > ObciSerial.FRAME_LENGTH) {

        current_byte = this.buf.shift();

        if (current_byte === 0xA0) {
          if (this.buf[ObciSerial.END_OFFSET] === 0xC0) { // FRAME_LENGTH - 2

            d = this.buf.splice(0, ObciSerial.FRAME_LENGTH - 1);

            current_frame_counter = d[0];

            i = 1;
            for (j = 0; j < 8; j++) {
              // 24 to 32
              this.samples[j] = d[i++] << 16 | d[i++] << 8 | d[i++];
              if (this.samples[j] > 0x7FFFFF) {
                this.samples[j] -= 0x1000000;
              }
            }
            for (j = 0; j < 3; j++) {
              // 16 to 32
              this.accel[j] = d[i++] << 8 | d[i++];
              if (this.accel[j] > 0x7FFF) {
                this.accel[j] -= 0x10000;
              }
            }

            this.frame_count++;
            // emitter.emit('frame', {samples: samples, accel: accel}); emit 'data' ?
            this.dispatcher({ target: this.id, messageType: MessageTypes.Data, data: { samples: this.samples, accel: this.accel, count: current_frame_counter } });
          }
          else {
            // this.postMessage({ error: 'start not matching stop', len: buf.length, char: buf[END_OFFSET] });
            console.log("{ error: 'start not matching stop', len: buf.length, char: buf[END_OFFSET] }");
          }
        }
        else {
          // this.postMessage({ error: 'drop one byte', byte: current_byte });
          // console.log("{ error: 'drop one byte', byte: current_byte }");
        }
      } // end while
    }
  } // end parser 
  
  // Board
  
  private log_stream: fs.WriteStream;
  private pending_write: string[] = [];

  private open(options: ISerialOptions) {
    
    // TODO (2) : serialPort.list
    this.log_control = options.logControl || false;
    var port = options.port; // || '/dev/ttyUSB0';
    options.baudrate = options.baudrate || 115200;
    
    try {

      console.log('serial > contructor port:' + port + ' rate:' + options.baudrate + ' useSimulator:' + options.useSimulator + ' log:' + this.log_control);
      
      if (options.useSimulator) {
        this.serialPort = new spSimu.SerialPort(port, options, false);
      }
      else {
        this.serialPort = new sp.SerialPort(port, options, false); 
      }

      this.serialPort.on('error', (err: Error) => {
        console.log('serial > onerror ' + err);
        this.event(SerialEvents.Error, err);
      });

      this.serialPort.on('data', (d: number[]) => { this.parser(null, d) })

    } catch (e) {
      // Error means port is not available for listening.
      console.log('serial > catch ' + e);
      this.event(SerialEvents.Error, { type: 'NO SERIAL PORT' });
    }
    
    this.serialPort.open((err: Error) => {
      console.log('open callback err: ' + err + ' ' + typeof err);
      if (err) {
        this.dispatcher({ target: this.id, messageType: MessageTypes.Error, data: { error: err.toString() } });
        this.event(SerialEvents.Error, err);
      }
      else {
        // log
        if (this.log_control) {
          var d = new Date();
          var filename = 'logs/log_c_' + d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + '-' +
            d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds() + '_' + d.getMilliseconds() + '.log';
          console.log('log control to ' + filename);
          this.log_stream = fs.createWriteStream(filename);

          this.log_stream.on('error', (err: Error) => {
            this.log_control = false;
            console.error(err);
            this.dispatcher({ target: this.id, messageType: MessageTypes.Error, data: { error: err.toString() } });
          });
        }

        this.event(SerialEvents.OnOpen);
      }
    });
  }

  private close() {
    this.serialPort.close((err: Error) => {
      console.log('close callback err: ' + err);
      if (err) {
        this.dispatcher({ target: this.id, messageType: MessageTypes.Error, data: { error: err.toString() } });
        this.event(SerialEvents.Error, err);
      }
      
      // TODO (1) : delete this.serialPort ?
      
    });

    if (this.log_control) {
      this.log_stream.end();
    }

  }

  private feed(c: number | string | string[]) {

    console.log('board.feed >' + c + ' (' + typeof c + ') isArray :' + (c instanceof Array));

    if (typeof c === 'number') {
      this.pending_write.push(String.fromCharCode(c)); // assume this is the charcode
    }
    else if (typeof c === 'string') {
      for (var i = 0; i < c.length; i++) {
        this.pending_write.push(c[i]);
      }
    }
    else if (c instanceof Array) {
      this.pending_write = this.pending_write.concat(c);
    }
    else {
      var err = new Error('board.feed > unknown type');
      console.error(err);
      this.dispatcher({ target: this.id, messageType: MessageTypes.Error, data: { error: err.toString() } });
      this.event(SerialEvents.Error, err);
    }
  }
	
  // return false if there is no more character to send or true if
  private sendNext() {

    var c = this.pending_write.shift();

    if (c === undefined) { // end of transmission
      console.log('sendNext > End of transmission');
      return false;
    }

    if (typeof c !== 'string' || c.length !== 1 || c === 's' || c === 'b') { // TODO (2) : check this in feed directly ?
      console.error('sendNext > Error : use api for command ' + c + ' ' + typeof c); // TODO (3) : reply error to websocket
      return false;
    }

    var d = new Date();
    console.log(d.toLocaleTimeString() + ':' + d.getMilliseconds() + ' > SEND NEXT ' + c);

    if (this.log_control) {
      this.log_stream.write(d.toLocaleTimeString() + ':' + d.getMilliseconds() + ' >>> ' + c + '\r\n');
      // log_stream.write(process.hrtime() + c + '\r\n');
    }

    this.serialPort.write(c, (err: Error, results: any) => {
      console.log('sendNext > ' + c + ' callback err: ' + err + ' results ' + JSON.stringify(results));
      if (err) {
        this.dispatcher({ target: this.id, messageType: MessageTypes.Error, data: { error: err.toString() } });
        this.event(SerialEvents.Error, err);
      }
    });

    return true; // TODO (1) : should be async, in case of write err (EVENT_WRITTEN ?)
  }

  private startStream() {
    this.parse_control = false;
    this.parse_frame = true;
    this.serialPort.write('b', (err: Error, results: any) => {
      console.log('startStream > Write b callback err: ' + err + ' results ' + results);
      if (err) {
        this.dispatcher({ target: this.id, messageType: MessageTypes.Error, data: { error: err.toString() } });
        this.event(SerialEvents.Error, err);
      }
    });
  }

  private stopStream() {
    // this.parse_frame = false; this.parse_control = true;  // No, only start to parse control again after timeout because of latency 
    this.serialPort.write('s', (err: Error, results: any) => {
      console.log('stopStream > Write s callback err: ' + err + ' results ' + results);
      if (err) {
        this.dispatcher({ target: this.id, messageType: MessageTypes.Error, data: { error: err.toString() } });
        this.event(SerialEvents.Error, err);
      }
      /* else {
        console.log('sent s (stop)');
        this.dispatcher({ target: this.id, messageType: MessageTypes.OnStopAck, data: {  } }); // TODO (5) : in case we want an ack 
      } */
    });
  }

  private reset() {
    this.parse_frame = false;
    this.parse_control = true;
    this.serialPort.write('v', (err: Error, results: any) => {
      console.log('reset > Write v callback err:' + err + ' results ' + results);
      if (err) {
        this.dispatcher({ target: this.id, messageType: MessageTypes.Error, data: { error: err.toString() } });
        this.event(SerialEvents.Error, err);
      }
    });
  }
  
  // State Machine // TODO (3) Extends StateMachine
  
  private timers: NodeJS.Timer[] = [];
  private _state = SerialStates.Closed;

  private writing = false;


  private state_table: StateTable = {
    [SerialStates.Closed]: {
      [SerialEvents.Open]: (options: ISerialOptions) => {
        this.open(options);
        this.setTimer(SerialEvents.Timeout, 3000); // 3s
        return SerialStates.Opening;
      }
    },
    [SerialStates.Opening]: { // Serialport opening
      [SerialEvents.OnOpen]: () => {
        this.clearTimer(SerialEvents.Timeout);
        this.parse_frame = false;
        this.parse_control = true;

        var option_reset_board_on_opening = true; // TODO (3) : user.options.reset_board_on_opening

        if (option_reset_board_on_opening) {
          this.reset();
          // this.setTimer(SerialEvents.Timeout, 3000);
          // return SerialStates.WaitingForBoard;
        }
        else { // option wait for board to be turned on by user
          // this.setTimer(SerialEvents.Timeout, 20000); // 20s
          // return SerialStates.WaitingForBoard;
        }
        return SerialStates.Idle;
      },
      [SerialEvents.Error]: () => {
        this.clearTimer(SerialEvents.Timeout);
        return SerialStates.Closed;
      },
      [SerialEvents.Timeout]: () => {
        this.dispatcher({ target: this.id, messageType: MessageTypes.Error, data: { error: 'timeout Opening' } });
        this.close();
        return SerialStates.Closed;
      }
    },
    [SerialStates.WaitingForBoard]: { // Waiting board to be turned on
      [SerialEvents.OnEndOfSection]: () => {
        this.clearTimer(SerialEvents.Timeout);
        return SerialStates.Idle;
      },
      [SerialEvents.GetPut]: (cmd: string) => {  // event for !option.reset_board_on_opening, TODO (3) : limit to command reset 'v' ?
        this.clearTimer(SerialEvents.Timeout);
        this.setTimer(SerialEvents.Timeout, 5000);
        this.feed(cmd);
        this.sendNext();
        return SerialStates.WaitingForBoard;
      },
      /* [SerialEvents.Timeout]: () => { // option wait for connecting board and waiting for v reset // done client side now !
  
         this.dispatcher( { target: this.id, messageType: MessageTypes.Error, data: 'timeout' });
         board.reset();
         // TODO (1) : if retries counter > 3 EVENT_CLOSE ?
         machine.setTimer('EVENT_CLOSE', 5000); // 5s
         return SerialStates.Closed;
       }, */
      [SerialEvents.Close]: () => {
        this.close();
        return SerialStates.Closed;
      }
    },
    [SerialStates.Idle]: {
      [SerialEvents.StreamStart]: () => {

        this.startStream();

        return SerialStates.Streaming;
      },
      [SerialEvents.GetPut]: (cmd: string) => {

        this.feed(cmd);
        if (!this.writing) {

          var d = new Date();
          console.log(d.toLocaleTimeString() + ':' + d.getMilliseconds() + ' > GET PUT ' + cmd);
          this.setTimer(SerialEvents.WriteNext, 20); // trigger first send event
        }

        return SerialStates.Idle;
      },
      [SerialEvents.OnControl]: (data: string) => { 

        // machine.clearTimer('EVENT_TIMEOUT');
        this.dispatcher({ target: this.id, messageType: MessageTypes.Control, data: { control: data } });

        return SerialStates.Idle;
      },
      [SerialEvents.WriteNext]: () => {

        this.writing = this.sendNext();

        if (this.writing) {
          this.setTimer(SerialEvents.WriteNext, 100); // trigger next send event
        }

        return SerialStates.Idle;
      },
      [SerialEvents.Timeout]: () => { 

        // TODO (0) : send and reset control_buffer on timeout ?
        this.dispatcher({ target: this.id, messageType: MessageTypes.Error, data: 'timeout' });

        return SerialStates.Idle;
      },
      [SerialEvents.Error]: (err: Error) => {

        this.dispatcher({ target: this.id, messageType: MessageTypes.Error, data: err });
        this.close();

        return SerialStates.Closed;
      },
      [SerialEvents.Close]: () => {

        this.close();

        return SerialStates.Closed;
      }
    },
    [SerialStates.Streaming]: {
      [SerialEvents.StreamStop]: () => {
        this.stopStream();
        this.setTimer(SerialEvents.Timeout, 3000);
        return SerialStates.WaitEnding;
      }
    },
    [SerialStates.WaitEnding]: {
      [SerialEvents.OnEndOfSection]: (data: any) => {

        this.clearTimer(SerialEvents.Timeout);
        this.dispatcher({ target: this.id, messageType: MessageTypes.Control, data: data });

        return SerialStates.Idle;
      },
      [SerialEvents.Timeout]: () => { 
        
        console.log('WaitEnding Timeout, assuming stream end'); // TODO (4) : observe stream to be sure ?
        
        this.parse_frame = false;
        this.parse_control = true;

        // TODO (1) : send and reset control_buffer on timeout ?
        // this.dispatcher({ target: this.id, messageType: MessageTypes.WaitEndingTimeout, data: { control: data } });
        
        /* // TODO (3) : user.option.reset_board_on_timeout
        this.reset();
        this.setTimer(SerialEvents.Timeout, 3000);
        return SerialStates.WaitingForBoard; */
        
        // do not reset + timeout, it's the user choice to reset board or not
        return SerialStates.Idle;
      }
    }
  }


  get state() {
    return this._state;
  }
  set state(new_state) {

    if (this.state_table[new_state] === undefined) {
      console.warn({ error: 'UnknownState', state: new_state });
      return;
    }

    if (this._state !== new_state) {
      
      // console.log('set state ' + this._state + ' >> ' + new_state);
      
      this._state = new_state;
      this.dispatcher({ target: this.id, messageType: MessageTypes.State, data: { state: new_state } });
    }
  }

  event(e: SerialEvents, data?: any) {

    // var d = new Date();
    // console.log(d.toLocaleTimeString() + ':' + d.getMilliseconds() + ' > event: (' + e + ')' + SerialEvents[e]
    //  + ' state: (' + this._state + ')' + SerialStates[this._state] + ' data: ' + (typeof data === 'string' ? data.replace(/\r/gm, '\\r').replace(/\n/gm, '\\n') : data));

    if (this.state_table[this._state][e] === undefined) {
      console.error({ error: 'UnkonwnEvent', event: e, state: this._state });
      return;
    }

    var new_state = this.state_table[this._state][e](data);
    if (new_state !== undefined) {
      this.state = new_state;
    }
  }

  setTimer(e: SerialEvents, duration: number) {
    // TODO (3) : reset existing or duplicate ?
    if (this.timers[e]) {
      console.error('setTimer > Error : timer already set ' + e);
      throw new Error(' timer already set'); // return;
    }
    this.timers[e] = setTimeout(() => { delete this.timers[e]; this.event(e); }, duration);
  }

  clearTimer(e: SerialEvents) {

    if (this.timers[e] !== undefined) {
      clearTimeout(this.timers[e]);
      delete this.timers[e];
      console.log('TIMERS > Clear timer (' + e + ')' + SerialEvents[e] + ' ' + this.timers);
    }
    else {
      console.error({ error: 'UNKNOWN_TIMER', event: e });
    }
  }
}