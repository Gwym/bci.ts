"use strict"

import * as util from 'util';
import * as stream from 'stream';

var simulate_open_error = false;
var packet_size = 10; // size of an individual packet on serial

var setChannelsSettings = function* (start: string) {

  var channel_id: string, val: string;

  if (start !== 'x') {
    console.error('setChannelsSettings > bad starter x ' + start);
    return;
  }

  channel_id = yield 'ready to accept new channel settings\r\n';
  console.log('received chan id' + channel_id + '\r\n');
  val = yield 'load setting for channel ' + channel_id + '\r\n';
  val = yield 'load setting 0 with ' + val + '\r\n'; // POWER_DOWN
  val = yield 'load setting 1 with ' + val + '\r\n'; // GAIN_SET
  val = yield 'load setting 2 with ' + val + '\r\n'; // INPUT_TYPE_SET
  val = yield 'load setting 3 with ' + val + '\r\n'; // BIAS_SET
  val = yield 'load setting 4 with ' + val + '\r\n'; // SRB2_SET
  val = yield 'load setting 5 with ' + val + '\r\n' // SRB1_SET
    + 'done receiving settings for channel ' + channel_id + '\r\n';
  if (val !== 'X') {
    console.error('setChannelsSettings > bad terminator X ' + val + '\r\n');
    return;
  }
  return 'updating channel settings to default\r\n';
};

var setLeadOffSettings = function* (start: string) {

  var channel_id: string, val: string;

  if (start !== 'z') {
    console.error('setLeadOffSettings > bad starter x ' + start);
    return;
  }

  channel_id = yield 'ready to accept new impedance detect settings\r\n';
  console.log('received chan id' + channel_id);
  val = yield 'changing LeadOff settings for channel ' + channel_id + '\r\n';
  val = yield 'load setting 0 with ' + val + '\r\n'; // PCHAN
  val = yield 'load setting 1 with ' + val + '\r\n' // NCHAN
    + 'done receiving leadOff settings for channel ' + channel_id + '\r\n';
  if (val !== 'Z') {
    console.error('setLeadOffSettings > bad terminator Z ' + val);
    return;
  }
  return 'updating impedance detect settings\r\n';
};

// to simulate board silence, set ack[i] to null.
var acks: { [index: string]: any }  = {
  '?': 'ID, 0x00, 0x3E, 0, 0, 1, 1, 1, 1, 1, 0\nCONFIG1, 0x01, 0x96, 1, 0, 0, 1, 0, 1, 1, 0\nCONFIG2, 0x02, 0xC0, 1, 1, 0, 0, 0, 0, 0, 0\nCONFIG3, 0x03, 0xEC, 1, 1, 1, 0, 1, 1, 0, 0\nLOFF, 0x04, 0x02, 0, 0, 0, 0, 0, 0, 1, 0\nCH1SET, 0x05, 0x68, 0, 1, 1, 0, 1, 0, 0, 0\nCH2SET, 0x06, 0x68, 0, 1, 1, 0, 1, 0, 0, 0\nCH3SET, 0x07, 0x68, 0, 1, 1, 0, 1, 0, 0, 0\nCH4SET, 0x08, 0x68, 0, 1, 1, 0, 1, 0, 0, 0\nCH5SET, 0x09, 0x68, 0, 1, 1, 0, 1, 0, 0, 0\nCH6SET, 0x0A, 0x68, 0, 1, 1, 0, 1, 0, 0, 0\nCH7SET, 0x0B, 0x68, 0, 1, 1, 0, 1, 0, 0, 0\nCH8SET, 0x0C, 0x68, 0, 1, 1, 0, 1, 0, 0, 0\nBIAS_SENSP, 0x0D, 0xFF, 1, 1, 1, 1, 1, 1, 1, 1\nBIAS_SENSN, 0x0E, 0xFF, 1, 1, 1, 1, 1, 1, 1, 1\nLOFF_SENSP, 0x0F, 0x00, 0, 0, 0, 0, 0, 0, 0, 0\nLOFF_SENSN, 0x10, 0x00, 0, 0, 0, 0, 0, 0, 0, 0\nLOFF_FLIP, 0x11, 0x00, 0, 0, 0, 0, 0, 0, 0, 0\nLOFF_STATP, 0x12, 0x00, 0, 0, 0, 0, 0, 0, 0, 0\nLOFF_STATN, 0x13, 0x00, 0, 0, 0, 0, 0, 0, 0, 0\n0x14, 0x0F, 0, 0, 0, 0, 1, 1, 1, 1\nMISC1, 0x15, 0x00, 0, 0, 0, 0, 0, 0, 0, 0\nMISC2, 0x16, 0x00, 0, 0, 0, 0, 0, 0, 0, 0\nCONFIG4, 0x17, 0x00, 0, 0, 0, 0, 0, 0, 0, 0\n0x07	0\n0x08	0\n0x09	0\n0x0A	0\n0x0B	0\n0x0C	0\n0x0D	0\n0x0E	0\n0x0F	33\n\n0x1F	0\n0x20	8\n0x21	0\n0x22	0\n0x23	18\n0x24	0\n0x25	0\n0x26	0\n0x27	0\n0x28	0\n0x29	0\n0x2A	0\n0x2B	0\n0x2C	0\n0x2D	0\n0x2E	0\n0x2F	20\n0x30	0\n0x31	0\n0x32	0\n0x33	0\n\n0x38	0\n0x39	0\n0x3A	0\n0x3B	0\n0x3C	0\n0x3D	0\n\n$$$',
  'd': <string>null, // no ack ?
  'D' : '123456$$$',
  'v': 'OpenBCI V3 32bit Board\nSetting ADS1299 Channel Values\nADS1299 Device ID: 0x2A\r\nLIS3DH Device ID: 0x22\r\n$$$'
  ,'x': setChannelsSettings,
  'z': setLeadOffSettings
}

var sinIter = function* (phase: number) {

    var phi = phase || 0,
        counter = 0,
        value: number, i: number,
        buffer = new ArrayBuffer(4),
        dv = new DataView(buffer);

    while(true) {
      yield 0xA0; // start
      yield counter++;
      if (counter > 255)
        counter = 0;
      // channels : 8 * 24 bits
      for (i = 0 ; i < 8 ; i++) {

       // value = Math.floor((Math.random() * 2 - 1) * 0x7FFFFF);
       // value = Math.floor(Math.sin(phi / 12) * 0x7FFFFF);
       value = Math.floor((Math.sin(phi / 12) + Math.sin(phi)) / 2 * 0x7FFFFF);

        // dataview.setInt32(byteOffset, value , littleEndian); force big endian to be consistent with board chip (???)
        dv.setInt32(0, value, false);
        yield dv.getUint8(1);
        yield dv.getUint8(2);
        yield dv.getUint8(3);
      //    yield 0x80;
      //    yield 0x00;
      //    yield 0x00;
      }
      // accel x y z 16 bits
      for (i = 0 ; i < 3 ; i++) {

        yield Math.floor(Math.random() * 0xFF);
        yield Math.floor(Math.random() * 0xFF);
      }
      yield 0xC0;
      phi++;
    }
}




/* var sendAck = function(self, ack) {

  // TODO (5) : split in packet_size parts
  console.log('Simulator > push ' +  ack.replace(/\r/gm,'\\r').replace(/\n/gm,'\\n');
  send_stack.push(ack);

  setTimeout(() => {

      var item;
      while (item = send_stack.shift()) {  // TODO (5) : delay ?
         console.log('Simulator > sendAck ' +  item.replace(/\r/gm,'\\r').replace(/\n/gm,'\\n');
          obci_parser(self, new Buffer(item));
      }
  },
  500);
} */



export module sp {
// util.inherits(SerialSimulator, stream.Stream);
  export class SerialPort extends stream.Stream {
  
    private debug_frame_counter = 0;
    private debug_frame_offset = 0;
  
    private stream_frame_ms = 10; // send a frame every ... ms  ~ 250 fps from board
    private control_frame_ms = 1;
  
    private debugSinGen = sinIter(0);
  
   // private obci_parser: (parser: any, buffer: Buffer) => void;
    private send_stack: number[];
  
    private stream_interval_ID: NodeJS.Timer;
    private control_interval_ID: NodeJS.Timer;
    private current_generator: IterableIterator<string>;
    private control_string = '';
    
    constructor(path: string, options: { framerate?: number, baudrate?: number, parser?: any }, openImmediately: boolean, callback?: () => void) {
      
      super();
  
      console.log('SerialSimulator > Create ' + path + ' ' + options);
      if (typeof options.framerate === 'number') {
        console.log('SerialSimulator > set framerate to ' + options.framerate);
        this.stream_frame_ms = options.framerate;
      }
  
      // this.obci_parser = options.parser;
    } 
    
  
    private feedReplier = (s: string) => {
  
      this.control_string += s;
  
      if (this.control_interval_ID === undefined) {
  
        this.control_interval_ID = setInterval(() => {
  
          var current_head = this.control_string.slice(0, 10);
  
          if (current_head.length === 0) {
            clearInterval(this.control_interval_ID);
            this.control_interval_ID = undefined;
            return;
          }
  
          this.control_string = this.control_string.slice(current_head.length);
  
          console.log('Simulator > Send data ' + current_head.replace(/\r/gm, '\\r').replace(/\n/gm, '\\n'));
  
          var length = current_head.length;
          var dataBuffer = new Buffer(current_head);
  
          // this.obci_parser(this, dataBuffer);
          this.emit('data', dataBuffer);
  
        }, this.control_frame_ms);
      }
    }
  
    open(callback: (err: Error) => void): void {
      console.log('SIMULATOR > OPEN');

      setTimeout(() => {
        if (simulate_open_error) {
          callback(new Error('test error'));
        }
        else {
          callback(null);
        }
      }, 0);
    }
  
    close(callback: (err: Error) => void): void {
      console.log('SIMULATOR > CLOSE');
      setTimeout(() => {
        callback(null);
        // callback(new Error('test error'));
      }, 0);
    }
  
    write(s: string, callback: (err: Error, result: any) => void) : void {
      console.log('Simulator > Write ' + s);
  
      /* if (!Buffer.isBuffer(buffer)) {
        buffer = new Buffer(buffer);
      }*/
  
      if (typeof s !== 'string') {
        throw new Error('SerialSimulator.write > argument must be a string ' + s + ' ' + typeof s);
      }
  
      var cmd = s; // arrayBufferToString(data);
  
      if (this.current_generator) {
        console.log('Simulator > feeding generator ' + cmd)
        var res = this.current_generator.next(cmd);
        console.log(res);
        if (res.value !== undefined) {
          this.feedReplier(res.value);
        }
        if (res.done) {
          this.current_generator = undefined;
        }
        return;
      }
  
      switch (cmd) {
        case 'b':
        this.stream_interval_ID = setInterval(() => {
  
            // console.log('SIMULATOR > send data');
  
            for (var k = 0 ; k < 10 ; k++) {
              var length = 10;
              var dataBuffer = new Buffer(length);
  
              for (var i = 0 ; i < length ; i++) {
                dataBuffer[i] = this.debugSinGen.next().value;
              }
  
              this.emit('data', dataBuffer);
              //this.obci_parser(this, dataBuffer);
  
            } // end for k
  
            }, this.stream_frame_ms);
          break;
  
        case 's':
          setTimeout(() => {
            clearInterval(this.stream_interval_ID); // TODO (4) : stop cleanly on frame end
            // self.emit('data', new Buffer('$$$'));
            // obci_parser(this, new Buffer('$$$'));
          }, 500);
          break;
  
  
  
        default:
  
          if (acks[cmd] === null) {
            console.log('Simulator > skip command ' + cmd)
          }
          else if (typeof acks[cmd] === 'string') {
  
            this.feedReplier(acks[cmd]);
          }
          else if (typeof acks[cmd] === 'function') {
  
            console.log('Simulator > starting generator ' + cmd)
            this.current_generator = acks[cmd](cmd);
  
            var res = this.current_generator.next();
            console.log(res);
            if (res.value !== undefined) {
              this.feedReplier(res.value);          }
            if (res.done) {
              this.current_generator = undefined;
            }
          }
          else {
            console.error('Simulator > Unknown command ' + s);
          }
      }
  
      setTimeout(() => { callback(null, {bytesSent: s.length});  }, 0);
    }

  };
}

  



