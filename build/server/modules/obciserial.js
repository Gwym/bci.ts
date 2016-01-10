"use strict";
var fs = require("fs");
var sp = require("serialport");
var commons_1 = require("../commons");
class ObciSerial {
    constructor(identifier, options, disp) {
        this.parse_control = false;
        this.parse_frame = false;
        this.buf = [];
        this.samples = [];
        this.accel = [];
        this.frame_count = 0;
        this.pending_write = [];
        this.timers = [];
        this._state = commons_1.SerialStates.Closed;
        this.writing = false;
        this.state_table = {
            [commons_1.SerialStates.Closed]: {
                [commons_1.SerialEvents.Open]: () => {
                    this.open();
                    this.setTimer(commons_1.SerialEvents.Timeout, 3000);
                    return commons_1.SerialStates.Opening;
                }
            },
            [commons_1.SerialStates.Opening]: {
                [commons_1.SerialEvents.OnOpen]: () => {
                    this.clearTimer(commons_1.SerialEvents.Timeout);
                    this.parse_frame = false;
                    this.parse_control = true;
                    var option_reset_board_on_opening = true;
                    if (option_reset_board_on_opening) {
                        this.reset();
                    }
                    else {
                    }
                    return commons_1.SerialStates.Idle;
                },
                [commons_1.SerialEvents.Error]: () => {
                    this.clearTimer(commons_1.SerialEvents.Timeout);
                    return commons_1.SerialStates.Closed;
                },
                [commons_1.SerialEvents.Timeout]: () => {
                    this.dispatcher({ target: this.id, messageType: commons_1.MessageTypes.Error, data: { error: 'timeout Opening' } });
                    this.close();
                    return commons_1.SerialStates.Closed;
                }
            },
            [commons_1.SerialStates.WaitingForBoard]: {
                [commons_1.SerialEvents.OnEndOfSection]: () => {
                    this.clearTimer(commons_1.SerialEvents.Timeout);
                    return commons_1.SerialStates.Idle;
                },
                [commons_1.SerialEvents.GetPut]: (cmd) => {
                    this.clearTimer(commons_1.SerialEvents.Timeout);
                    this.setTimer(commons_1.SerialEvents.Timeout, 5000);
                    this.feed(cmd);
                    this.sendNext();
                    return commons_1.SerialStates.WaitingForBoard;
                },
                [commons_1.SerialEvents.Close]: () => {
                    this.close();
                    return commons_1.SerialStates.Closed;
                }
            },
            [commons_1.SerialStates.Idle]: {
                [commons_1.SerialEvents.StreamStart]: () => {
                    this.startStream();
                    return commons_1.SerialStates.Streaming;
                },
                [commons_1.SerialEvents.GetPut]: (cmd) => {
                    this.feed(cmd);
                    if (!this.writing) {
                        var d = new Date();
                        console.log(d.toLocaleTimeString() + ':' + d.getMilliseconds() + ' > GET PUT ' + cmd);
                        this.setTimer(commons_1.SerialEvents.WriteNext, 20);
                    }
                    return commons_1.SerialStates.Idle;
                },
                [commons_1.SerialEvents.OnControl]: (data) => {
                    this.dispatcher({ target: this.id, messageType: commons_1.MessageTypes.Control, data: { control: data } });
                    return commons_1.SerialStates.Idle;
                },
                [commons_1.SerialEvents.WriteNext]: () => {
                    this.writing = this.sendNext();
                    if (this.writing) {
                        this.setTimer(commons_1.SerialEvents.WriteNext, 100);
                    }
                    return commons_1.SerialStates.Idle;
                },
                [commons_1.SerialEvents.Timeout]: () => {
                    this.dispatcher({ target: this.id, messageType: commons_1.MessageTypes.Error, data: 'timeout' });
                    return commons_1.SerialStates.Idle;
                },
                [commons_1.SerialEvents.Error]: (err) => {
                    this.dispatcher({ target: this.id, messageType: commons_1.MessageTypes.Error, data: err });
                    this.close();
                    return commons_1.SerialStates.Closed;
                },
                [commons_1.SerialEvents.Close]: () => {
                    this.close();
                    return commons_1.SerialStates.Closed;
                }
            },
            [commons_1.SerialStates.Streaming]: {
                [commons_1.SerialEvents.StreamStop]: () => {
                    this.stopStream();
                    this.setTimer(commons_1.SerialEvents.Timeout, 3000);
                    return commons_1.SerialStates.WaitEnding;
                }
            },
            [commons_1.SerialStates.WaitEnding]: {
                [commons_1.SerialEvents.OnEndOfSection]: (data) => {
                    this.clearTimer(commons_1.SerialEvents.Timeout);
                    this.dispatcher({ target: this.id, messageType: commons_1.MessageTypes.Control, data: data });
                    return commons_1.SerialStates.Idle;
                },
                [commons_1.SerialEvents.Timeout]: () => {
                    console.log('WaitEnding Timeout, assuming stream end');
                    this.parse_frame = false;
                    this.parse_control = true;
                    return commons_1.SerialStates.Idle;
                }
            }
        };
        this.id = commons_1.BlocksTypes.Serial;
        this.log_control = options.log_control || false;
        var port = options.port || '/dev/ttyUSB0';
        var baudrate = options.baudrate || 115200;
        this.dispatcher = disp;
        this.timestamp_start = process.hrtime();
        try {
            console.log('serial > contructor port:' + port + ' rate:' + baudrate);
            this.serialPort = new sp.SerialPort(port, {
                baudrate: baudrate
            }, false);
            this.serialPort.on('error', (err) => {
                console.log('serial > onerror ' + err);
                this.event(commons_1.SerialEvents.Error, err);
            });
            this.serialPort.on('data', (d) => { this.parser(null, d); });
        }
        catch (e) {
            console.log('serial > catch ' + e);
            this.event(commons_1.SerialEvents.Error, { type: 'NO SERIAL PORT' });
        }
    }
    handler(message) {
        if (message.messageType === commons_1.MessageTypes.RequestState) {
            this.dispatcher({ target: this.id, messageType: commons_1.MessageTypes.State, data: { state: this.state } });
        }
        else if (message.messageType === commons_1.MessageTypes.Control) {
            if (typeof (message.event) !== 'number') {
                console.warn('handler > no Event');
            }
            this.event(message.event, message.data);
        }
        else {
            console.error(new Error('UnknownMessageType'));
        }
    }
    parser(emitter, buffer) {
        var timestamp_step = process.hrtime(this.timestamp_start);
        this.timestamp_start = process.hrtime();
        if (this.parse_control) {
            this.event(commons_1.SerialEvents.OnControl, buffer.toString());
            if (this.log_control) {
                var date = new Date();
                this.log_stream.write(date.toLocaleTimeString() + ':' + date.getMilliseconds() + ' < ' + buffer.toString().replace(/\r/gm, '\\r').replace(/\n/gm, '\\n') + '\r\n');
            }
        }
        if (this.parse_frame) {
            var i;
            for (i = 0; i < buffer.length; i++) {
                this.buf.push(buffer[i]);
            }
            if (this.buf.length > ObciSerial.LIMIT) {
                console.log("{error: 'No frame decoded, discarding whole buffer.', length: buf.length }");
                this.buf = [];
                return;
            }
            var current_byte, current_frame_counter, d, j;
            while (this.buf.length > ObciSerial.FRAME_LENGTH) {
                current_byte = this.buf.shift();
                if (current_byte === 0xA0) {
                    if (this.buf[ObciSerial.END_OFFSET] === 0xC0) {
                        d = this.buf.splice(0, ObciSerial.FRAME_LENGTH - 1);
                        current_frame_counter = d[0];
                        i = 1;
                        for (j = 0; j < 8; j++) {
                            this.samples[j] = d[i++] << 16 | d[i++] << 8 | d[i++];
                            if (this.samples[j] > 0x7FFFFF) {
                                this.samples[j] -= 0x1000000;
                            }
                        }
                        for (j = 0; j < 3; j++) {
                            this.accel[j] = d[i++] << 8 | d[i++];
                            if (this.accel[j] > 0x7FFF) {
                                this.accel[j] -= 0x10000;
                            }
                        }
                        this.frame_count++;
                        this.dispatcher({ target: this.id, messageType: commons_1.MessageTypes.Data, data: { samples: this.samples, accel: this.accel, count: current_frame_counter } });
                    }
                    else {
                        console.log("{ error: 'start not matching stop', len: buf.length, char: buf[END_OFFSET] }");
                    }
                }
                else {
                }
            }
        }
    }
    open() {
        this.serialPort.open((err) => {
            console.log('open callback err: ' + err + ' ' + typeof err);
            if (err) {
                this.dispatcher({ target: this.id, messageType: commons_1.MessageTypes.Error, data: { error: err.toString() } });
                this.event(commons_1.SerialEvents.Error, err);
            }
            else {
                if (this.log_control) {
                    var d = new Date();
                    var filename = 'logs/log_c_' + d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + '-' +
                        d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds() + '_' + d.getMilliseconds() + '.log';
                    console.log('log control to ' + filename);
                    this.log_stream = fs.createWriteStream(filename);
                    this.log_stream.on('error', (err) => {
                        this.log_control = false;
                        console.error(err);
                        this.dispatcher({ target: this.id, messageType: commons_1.MessageTypes.Error, data: { error: err.toString() } });
                    });
                }
                this.event(commons_1.SerialEvents.OnOpen);
            }
        });
    }
    close() {
        this.serialPort.close((err) => {
            console.log('close callback err: ' + err);
            if (err) {
                this.dispatcher({ target: this.id, messageType: commons_1.MessageTypes.Error, data: { error: err.toString() } });
                this.event(commons_1.SerialEvents.Error, err);
            }
        });
        if (this.log_control) {
            this.log_stream.end();
        }
    }
    feed(c) {
        console.log('board.feed >' + c + ' (' + typeof c + ') isArray :' + (c instanceof Array));
        if (typeof c === 'number') {
            this.pending_write.push(String.fromCharCode(c));
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
            this.dispatcher({ target: this.id, messageType: commons_1.MessageTypes.Error, data: { error: err.toString() } });
            this.event(commons_1.SerialEvents.Error, err);
        }
    }
    sendNext() {
        var c = this.pending_write.shift();
        if (c === undefined) {
            console.log('sendNext > End of transmission');
            return false;
        }
        if (typeof c !== 'string' || c.length !== 1 || c === 's' || c === 'b') {
            console.error('sendNext > Error : use api for command ' + c + ' ' + typeof c);
            return false;
        }
        var d = new Date();
        console.log(d.toLocaleTimeString() + ':' + d.getMilliseconds() + ' > SEND NEXT ' + c);
        if (this.log_control) {
            this.log_stream.write(d.toLocaleTimeString() + ':' + d.getMilliseconds() + ' >>> ' + c + '\r\n');
        }
        this.serialPort.write(c, (err, results) => {
            console.log('sendNext > ' + c + ' callback err: ' + err + ' results ' + JSON.stringify(results));
            if (err) {
                this.dispatcher({ target: this.id, messageType: commons_1.MessageTypes.Error, data: { error: err.toString() } });
                this.event(commons_1.SerialEvents.Error, err);
            }
        });
        return true;
    }
    startStream() {
        this.parse_control = false;
        this.parse_frame = true;
        this.serialPort.write('b', (err, results) => {
            console.log('startStream > Write b callback err: ' + err + ' results ' + results);
            if (err) {
                this.dispatcher({ target: this.id, messageType: commons_1.MessageTypes.Error, data: { error: err.toString() } });
                this.event(commons_1.SerialEvents.Error, err);
            }
        });
    }
    stopStream() {
        this.serialPort.write('s', (err, results) => {
            console.log('stopStream > Write s callback err: ' + err + ' results ' + results);
            if (err) {
                this.dispatcher({ target: this.id, messageType: commons_1.MessageTypes.Error, data: { error: err.toString() } });
                this.event(commons_1.SerialEvents.Error, err);
            }
        });
    }
    reset() {
        this.parse_frame = false;
        this.parse_control = true;
        this.serialPort.write('v', (err, results) => {
            console.log('reset > Write v callback err:' + err + ' results ' + results);
            if (err) {
                this.dispatcher({ target: this.id, messageType: commons_1.MessageTypes.Error, data: { error: err.toString() } });
                this.event(commons_1.SerialEvents.Error, err);
            }
        });
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
            this._state = new_state;
            this.dispatcher({ target: this.id, messageType: commons_1.MessageTypes.State, data: { state: new_state } });
        }
    }
    event(e, data) {
        var d = new Date();
        if (this.state_table[this._state][e] === undefined) {
            console.error({ error: 'UnkonwnEvent', event: e, state: this._state });
            return;
        }
        var new_state = this.state_table[this._state][e](data);
        if (new_state !== undefined) {
            this.state = new_state;
        }
    }
    setTimer(e, duration) {
        if (this.timers[e]) {
            console.error('setTimer > Error : timer already set ' + e);
            throw new Error(' timer already set');
        }
        this.timers[e] = setTimeout(() => { delete this.timers[e]; this.event(e); }, duration);
    }
    clearTimer(e) {
        if (this.timers[e] !== undefined) {
            clearTimeout(this.timers[e]);
            delete this.timers[e];
            console.log('TIMERS > Clear timer (' + e + ')' + commons_1.SerialEvents[e] + ' ' + this.timers);
        }
        else {
            console.error({ error: 'UNKNOWN_TIMER', event: e });
        }
    }
}
ObciSerial.LIMIT = 512;
ObciSerial.FRAME_LENGTH = 33;
ObciSerial.END_OFFSET = ObciSerial.FRAME_LENGTH - 2;
exports.ObciSerial = ObciSerial;
