"use strict"

/// <reference path="common.ts" />
/// <reference path="ui_core.ts" />
/// <reference path="bci_plot.ts" />

class UiSerial implements MessageConsumer {
  
  identifier: BlocksTypes;
  private command = {
    resetBoard: 'v',
    getChannelsSettings: 'D',
    resetChannelsSettings : 'd',
    getRegistersSettings : '?'
  }

  constructor(id: BlocksTypes, options: {}) {

    this.identifier = id;
    this.init(options);
    
    // apply fake state to ui waiting for servers's answer // TODO (1) : request on startup ?
    // this.onState({  state: null, oldState: SerialStates.Closed });
  }
  
  private open_close_button: HTMLButtonElement;
  private start_stop_button: HTMLButtonElement;
  private reset_board_button: HTMLButtonElement;
  private board_state: HTMLElement;
  private board_error: HTMLElement;
  private board_settings: HTMLElement;
  private settings_tbody: HTMLElement; // contains the table of settings
  private board_settings_button: HTMLButtonElement;
  private bsb_get: HTMLButtonElement;
  private bsb_get_registers: HTMLButtonElement;
  private bsb_set: HTMLButtonElement;
  private bsb_reset: HTMLButtonElement;
  private bsb_cancel: HTMLButtonElement;
  private fps: HTMLElement;
  private frame_count: HTMLElement;
  private frame_miss: HTMLElement;

  private performance_frame_count: number;
  private performance_start_time: number;
  private control_string = '';
  private control_timeout_ID: number;
  
  private _board_virtual_disabled = true; // default true, triggered by board opening and settings changes
  private get board_virtual_disabled() { return this._board_virtual_disabled }
  private set board_virtual_disabled(b: boolean) {
    // console.log('set board_virtual_disabled = ' + b + ', current:' + this.bsb_set.disabled + ', board_virtual_disabled:' + this.board_virtual_disabled + ', settings_virtual_disabled:' + this.settings_virtual_disabled);
    this._board_virtual_disabled = b;
    this.bsb_set.disabled = this._settings_virtual_disabled || this._board_virtual_disabled;
  }
        
  private _settings_virtual_disabled = true;
  private get settings_virtual_disabled() { return this._settings_virtual_disabled }
  private set settings_virtual_disabled(b: boolean) {
    // console.log('set board_virtual_disabled = ' + b + ', current:' + this.bsb_set.disabled + ', board_virtual_disabled:' + this.board_virtual_disabled + ', settings_virtual_disabled:' + this.settings_virtual_disabled);
    this._settings_virtual_disabled = b
    this.bsb_set.disabled = this._settings_virtual_disabled || this._board_virtual_disabled;
  }
  
  private _settings_string = '';
  private get settings_string() { return this._settings_string }
  private set settings_string(s) {
    // console.log('set settings_string = ' + s);
    this._settings_string = s;
    if (s.length === 0) {
      this.settings_virtual_disabled = true;
      this.bsb_cancel.disabled = true;
    }
    else {
      this.settings_virtual_disabled = false;
      this.bsb_cancel.disabled = false;
    }
  }


  // Handlers : using fat arrows to capture this

  private open_handler = () => { // TODO (3) : generic function(e) { var btn = e.target; btn.disabled = true; postMessage data: btn.data ... if ( btn.anim !== undefined  ) reg/unreg... } ?

    this.open_close_button.disabled = true;
    worker.postMessage(<WebsocketMessage>{ 
      target: this.identifier, messageType: MessageTypes.Control, event: SerialEvents.Open, data: {}
    });
  }

  private close_handler = () => {

    this.open_close_button.disabled = true;
    worker.postMessage(<WebsocketMessage>{
       target: this.identifier, messageType: MessageTypes.Control, event: SerialEvents.Close, data: {}
    });
  }

  private stop_handler = () => {

    this.start_stop_button.disabled = true;

    worker.postMessage(<WebsocketMessage>{
       target: this.identifier, messageType: MessageTypes.Control, event: SerialEvents.StreamStop, data: { connect_to_ws: false }
    });
    system.unregisterAnim(bci_plot.redraw);
  }
  
  private start_handler = () => {

    // start_stop_button.disabled = true;
    this.open_close_button.disabled = true;

    worker.postMessage(<WebsocketMessage>{
      target: this.identifier, messageType: MessageTypes.Control, event: SerialEvents.StreamStart, data: { connect_to_ws: true }
    });

    this.performance_frame_count = 0;
    this.performance_start_time = performance.now();

    system.registerAnim(bci_plot.redraw);
  }
  
  init(options?: { name?: string }) {
    
        // system.addControl(name, e)
     var container: HTMLElement = document.getElementById('blocks-control');

     var e: HTMLElement = document.createElement('span');
     var h1 = document.createElement('h1');
     
      h1.textContent = (options && options.name ? options.name : i18n.unknown );

      e.id = 'device_ID_' + this.identifier;
      h1.appendChild(e);

      container.appendChild(h1);

      e = document.createElement('div');

      this.open_close_button = document.createElement('input');
      this.open_close_button.className = 'serial_button';
      this.open_close_button.type = 'button';
      e.appendChild(this.open_close_button);

      this.start_stop_button = document.createElement('input');
      this.start_stop_button.className = 'serial_button';
      this.start_stop_button.type = 'button';
      e.appendChild(this.start_stop_button);

      this.fps = document.createElement('var');
      this.fps.textContent = '0';
      e.appendChild(this.fps);
      
      var label = document.createElement('label');
      label.textContent = i18n.sample_per_second;
      e.appendChild(label);
      
      this.frame_count = document.createElement('var');
      this.frame_count.textContent = '0';
      e.appendChild(this.frame_count);
      label = document.createElement('label');
      label.textContent = i18n.frame_count;
      e.appendChild(label);
      
      this.frame_miss = document.createElement('var');
      this.frame_miss.textContent = '0';
      e.appendChild(this.frame_miss);
      label = document.createElement('label');
      label.textContent = i18n.frame_miss;
      e.appendChild(label);

      this.board_state = document.createElement('span');
      this.board_state.id = 'board_state'; // for applying styles
      e.appendChild(this.board_state);

      this.board_error = document.createElement('span');
      this.board_error.id = 'board_error'; // for applying styles
      this.board_error.addEventListener('click', (e) => { this.board_error.textContent = ''; this.board_error.style.display = 'none'; });
      // TODO (0) : when shoul error message be cleard ? on user action ? on board ack ? on reset ?
      e.appendChild(this.board_error);

      // board settings
      
      this.board_settings_button = document.createElement('button');
      this.board_settings_button.className = 'serial_button';
      this.board_settings_button.textContent = String.fromCharCode(9881) + ' ' + i18n.board_settings_button;
      this.board_settings_button.onclick = () => { this.board_settings.style.display = this.board_settings.style.display === 'block' ? 'none' : 'block' }; // toggle visibility
      e.appendChild(this.board_settings_button);

      this.reset_board_button  = document.createElement('button');
      this.reset_board_button.className = 'serial_button';
      this.reset_board_button.textContent = i18n.reset_board;
      this.reset_board_button.onclick = () => {
        console.log('reset board (' + this.command.resetBoard + ')');
        // reset_board_button.disabled = true;
        worker.postMessage(<WebsocketMessage>{
            target: this.identifier, messageType: MessageTypes.Control, event: SerialEvents.GetPut, data: this.command.resetBoard 
          });
      };  
      e.appendChild(this.reset_board_button);

      this.board_settings = document.createElement('div');
      this.board_settings.style.display = 'none';

      var table = document.createElement('table');
      var caption = document.createElement('caption');
      caption.textContent = i18n.board_settings;

      this.bsb_get = document.createElement('button');
      this.bsb_get.className = 'bsb_button';
      this.bsb_get.textContent = i18n.bsb_get;
      this.bsb_get.onclick = () => {
        console.log('get settings (' + this.command.getChannelsSettings + ')');
        // bsb_get.disabled = true;
        worker.postMessage(<WebsocketMessage>{
            target: this.identifier, messageType: MessageTypes.Control, event: SerialEvents.GetPut, data: this.command.getChannelsSettings 
          });
      }
      caption.appendChild(this.bsb_get);

      this.bsb_reset = document.createElement('button');
      this.bsb_reset.className = 'bsb_button';
      this.bsb_reset.textContent = i18n.bsb_reset;
      this.bsb_reset.onclick = () => {

        console.log('reset settings (d)');
        // bsb_reset.disabled = true;
        worker.postMessage(<WebsocketMessage>{
            target: this.identifier, messageType: MessageTypes.Control, event: SerialEvents.GetPut, data: this.command.resetChannelsSettings 
          });
      }
      caption.appendChild(this.bsb_reset);

      this.bsb_set = document.createElement('button');
      this.bsb_set.className = 'bsb_button bsb_set';
      this.bsb_set.textContent = i18n.bsb_set;
      this.bsb_set.onclick = () => { this.applySettingsChanges() };

      caption.appendChild(this.bsb_set);

      this.bsb_cancel = document.createElement('button');
      this.bsb_cancel.className = 'bsb_button bsb_cancel';
      this.bsb_cancel.textContent = i18n.bsb_cancel;
      this.bsb_cancel.disabled = true;
      this.bsb_cancel.onclick = () => { this.restoreOriginalSettings() };
      caption.appendChild(this.bsb_cancel);

      this.bsb_get_registers = document.createElement('button');
      this.bsb_get_registers.className = 'bsb_button bsb_get_registers';
      this.bsb_get_registers.textContent = i18n.bsb_get_registers;
      this.bsb_get_registers.onclick = () => {

        console.log('get settings (?)');

        //bsb_get_registers.disabled = true;
        worker.postMessage(<WebsocketMessage>{
            target: this.identifier, messageType: MessageTypes.Control, event: SerialEvents.GetPut, data: this.command.getRegistersSettings 
        });
      }
      caption.appendChild(this.bsb_get_registers);

      table.appendChild(caption);
      var thead = document.createElement('thead');
      this.settings_tbody = document.createElement('tbody');
      this.settings_tbody.id = 'board_settings_' + this.identifier;

      this.setChannelConfiguration(this.settings_tbody, []); // set defaut configuration, assuming board was reseted // TODO (4) : always read from board on startup ?

      var tr = document.createElement('tr');
      var t:HTMLTableHeaderCellElement ;

      ['adc_channel', 'adc_disabled','adc_gain', 'adc_input_type', 'adc_bias', 'adc_SRB2', 'adc_SRB1', 'adc_impedance_p', 'adc_impedance_n'].forEach(function(field) {
        t = document.createElement('th');
        
        t.textContent = i18n.settings_title[field];
        if (i18n.settings_hint[field]) {
          t.title = i18n.settings_hint[field];
        }
        tr.appendChild(t);
      });

      thead.appendChild(tr);

      table.appendChild(thead);
      table.appendChild(this.settings_tbody);
      this.board_settings.appendChild(table);

      e.appendChild(this.board_settings);

      container.appendChild(e);
    
  } // end init
 
 
  handler(m: WebsocketMessage) {
    
    switch (m.messageType) {
      case MessageTypes.State: 
        this.onState(m);
        break;
      case MessageTypes.Control:
        this.onControl(m);
        break;
      case MessageTypes.Data:
        this.onData(m);
        break;
      case MessageTypes.Error:
        this.onError(new Error(m.data.error));
        break;
      default:
        this.onError(new Error('UnknownMessageType ' + m.messageType + ' ' + MessageTypes[m.messageType]));
    }  
  }
  
  private setChannelConfiguration(tbody: HTMLElement, config: number[][]) {

    // TODO (0) : decode ack
    console.log('configuration : ');
    console.log(config);

    // TODO (0) : document fragment
    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }

    var tr: HTMLTableRowElement;
    var t: HTMLTableDataCellElement;
    var checkbox: HTMLInputElement;
    var o: HTMLOptionElement;
    var select: HTMLSelectElement;

    // overwrite checkbox.value to have true <=> 1 false <=> 0 strings, to be consistent with select
    var checkbox_getter = function() { return this.checked ? '1' : '0' };
    var checkbox_setter = function(b: string) { this.checked = b === '0' || !b ? false : true };  // accept number and string 0,1

    for (var c = 0; c < 8; c++) {

      if (!config[c]) {
        // console.warn('no config for channel ' + c);
        //          [OFF, GAIN, SRC, BIAS, SRB2, SRB1, P,  N]
        config[c] = [0, 6, 0, 1, 1, 0, 0, 0];
      }

      tr = document.createElement('tr');

      t = document.createElement('td');
      t.textContent = i18n.channels[c];
      tr.appendChild(t);

      t = document.createElement('td');
      checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = (config[c][0] === 0 ? false : true); // TODO (2) : o.checked = options.adc_disabled.default (on = 0 off = 1)
      checkbox.onchange = (e: Event) => { this.refreshSetOrCancel(e) }; // TODO (2) : event delegation ?
      Object.defineProperty(checkbox, 'value', { get: checkbox_getter, set: checkbox_setter });
      checkbox.dataset['original_value'] = checkbox.value;
      t.appendChild(checkbox);
      tr.appendChild(t);

      t = document.createElement('td');
      select = document.createElement('select');
      ['1', '2', '4', '6', '8', '12', '24'].forEach(function(element, index) {
        o = document.createElement('option');
        o.textContent = element;
        o.value = index.toString();
        select.appendChild(o);
      });
      select.selectedIndex = config[c][1]; // TODO (2) :select.selectedIndex = options.adc_gain.default (0 = x1 ... 6 = x24)
      select.onchange = (e: Event) => { this.refreshSetOrCancel(e) };
      select.dataset['original_value'] = select.value;
      t.appendChild(select);
      tr.appendChild(t);


      t = document.createElement('td');
      select = document.createElement('select');
      i18n.adc_input_type_values.forEach(function(element, index) {
        o = document.createElement('option');
        o.textContent = element;
        o.value = index.toString();
        select.appendChild(o);
      });
      select.selectedIndex = config[c][2]; // TODO (2) :select.selectedIndex = options.adc_input_type'.default (0 = NORMAL)
      select.onchange = (e: Event) => { this.refreshSetOrCancel(e) };
      select.dataset['original_value'] = select.value;
      t.appendChild(select);
      tr.appendChild(t);

      for (var i = 3; i < 8; i++) {
        t = document.createElement('td');
        checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = (config[c][i] === 0 ? false : true);
        checkbox.onchange = (e: Event) => { this.refreshSetOrCancel(e) };
        Object.defineProperty(checkbox, 'value', { get: checkbox_getter, set: checkbox_setter });
        checkbox.dataset['original_value'] = checkbox.value;
        t.appendChild(checkbox);
        tr.appendChild(t);
      }

      tbody.appendChild(tr);
    }
  }


  private refreshSetOrCancel(e: Event) {

    // console.log('onchange refreshSetOrCancel > value: ' + (<HTMLInputElement>e.target).value + ' checked:' +
    //   (<HTMLInputElement>e.target).checked + ' original_value: ' + (<HTMLInputElement>e.target).dataset["original_value"]);

    // refresh by looking at all

    var c: number;
    var i: number;
    var channels: HTMLCollection; // of HTMLTableRowElement
    var settings: HTMLCollection; // of HTMLTableDataCellElement;
    var input: HTMLInputElement;
    var value_changed: boolean;
    var channel_str: string;
    var board_str = '';

    channels = this.settings_tbody.children; // tr's
    for (c = 0; c < channels.length; c++) { // foreach tr
      settings = (<HTMLTableRowElement>channels.item(c)).children; // td's

      // Channel Setting Commands : disabled 1 to SRB1 6
      value_changed = false;
      channel_str = 'x' + (c + 1); // channels are 1 based
      for (i = 1; i < 7; i++) {
        input = <HTMLInputElement>settings[i].firstChild;
        if (input.dataset['original_value'] !== input.value) {
          // console.log('channel ' + c + ' setting ' + i + ' value:' + input.value + ' ' +  typeof input.value  + ' original_value:'  + input.original_value  + ' ' +  typeof  input.original_value );
          value_changed = true;
        }
        channel_str += input.value;
      }
      if (value_changed) {
        board_str += channel_str + 'X';
      }

      // LeadOff Impedance Commands : 7 & 8
      value_changed = false;
      channel_str = 'z' + (c + 1); // channels are 1 based
      for (i = 7; i < 9; i++) { // skip channel name at 0, disabled 1 to SRB1 6
        input = <HTMLInputElement>settings[i].firstChild;
        if (input.dataset['original_value'] !== input.value) {
          // console.log('channel ' + c + ' setting ' + i + ' value:' + input.value + ' ' +  typeof input.value  + ' original_value:'  + input.original_value  + ' ' +  typeof  input.original_value );
          value_changed = true;
        }
        channel_str += input.value;
      }
      if (value_changed) {
        board_str += channel_str + 'Z';
      }
    }
    this.settings_string = board_str;
  }


  private applySettingsChanges() {

    // console.log('applySettingsChanges > settings_string:' + this.settings_string);

    worker.postMessage(<WebsocketMessage>{
      target: this.identifier, messageType: MessageTypes.Control, event: SerialEvents.GetPut, data: this.settings_string
    });

    this.settings_string = '';

    // refresh original values // TODO (5) : get state from board to check ?
    var c: number;
    var i: number;
    var settings: HTMLCollection; // of HTMLTableDataCellElement;
    var input: HTMLInputElement;
    var channels: HTMLCollection = this.settings_tbody.children; // tr's
          
    for (c = 0; c < channels.length; c++) { // foreach tr
      settings = (<HTMLTableRowElement>channels.item(c)).children; // td's

      for (i = 1; i < 9; i++) {
        input = <HTMLInputElement>settings.item(i).firstChild;
        if (input.value !== input.dataset['original_value']) {
          input.dataset['original_value'] = input.value;
        }
      }
    }
  }
  private restoreOriginalSettings() {

    console.log('restoreOriginalSettings > settings_string:' + this.settings_string);

    this.settings_string = '';
    var c: number;
    var i: number;
    var settings: HTMLCollection; // of HTMLTableDataCellElement;
    var input: HTMLInputElement;
    var channels: HTMLCollection = this.settings_tbody.children; // tr's
          
    for (c = 0; c < channels.length; c++) { // foreach tr
      settings = (<HTMLTableRowElement>channels.item(c)).children; // td's

      for (i = 1; i < 9; i++) {
        input = <HTMLInputElement>settings.item(i).firstChild;
        // console.log('channel ' + c + ' setting ' + i + ' value:' + input.value + ' ' +  typeof input.value  + ' original_value:'  + input.original_value  + ' ' +  typeof  input.original_value );
        if (input.value !== input.dataset['original_value']) {
          input.value = input.dataset['original_value'];
        }
      }
    }
  }
  
  private onData(m: WebsocketMessage) {
 
      this.frame_count.textContent = (this.performance_frame_count++).toString();
      this.fps.textContent = (1000 * this.performance_frame_count / (performance.now() - this.performance_start_time)).toFixed(2);

      bci_data.feed(m.data.samples);
      // TODO (1)  : process data.accel
  }
  
  private onState(m: WebsocketMessage) {
    
      var newState = m.data.state;
      // console.log(this.identifier + ' onState: ' + newState + ' ' + SerialStates[newState]); // TODO (1) : request decoder

      // if (m.state === oldState) {  return;  }

      this.board_state.textContent = i18n.board_state[newState];
      this.board_state.className = newState.toString();

      if (newState !== SerialStates.Idle) {
        this.bsb_get.disabled = true;
        this.bsb_reset.disabled = true;
        this.board_virtual_disabled = true; // regardless of current settings changes
        this.bsb_get_registers.disabled = true;
      }

      // TODO (5) : if (m.state === SerialStates.Streaming)  set another handler to channels disable/enable ?

      switch (newState) {
        case SerialStates.Closed:
          this.open_close_button.value = i18n.open;
          this.open_close_button.onclick = this.open_handler;
          this.open_close_button.disabled = false;
          this.start_stop_button.value = i18n.start;
          this.start_stop_button.disabled = true;
          this.reset_board_button.disabled = true;
          break;
        case SerialStates.Opening:
        case SerialStates.WaitingForBoard:
          this.open_close_button.value = i18n.close;
          this.open_close_button.onclick = this.close_handler;
          this.open_close_button.disabled = false;
          this.start_stop_button.value = i18n.start;
          this.start_stop_button.disabled = true;
          this.reset_board_button.disabled = false;
          break;
        case SerialStates.Idle:
          // console.log('idle (onready) '  + m.control);
          this.open_close_button.value = i18n.close;
          this.open_close_button.onclick = this.close_handler;
          this.open_close_button.disabled = false;
          this.start_stop_button.value = i18n.start;
          this.start_stop_button.onclick = this.start_handler;
          this.start_stop_button.disabled = false;
          this.reset_board_button.disabled = false;

          this.bsb_get.disabled = false;
          this.board_virtual_disabled = false; // regardless of current settings changes
          this.bsb_reset.disabled = false;
          this.bsb_get_registers.disabled = false;
          break;
        case SerialStates.Streaming:
          this.open_close_button.value = i18n.close;
          this.open_close_button.disabled = true;
          this.start_stop_button.value = i18n.stop;
          this.start_stop_button.onclick = this.stop_handler;
          this.start_stop_button.disabled = false;
          this.reset_board_button.disabled = false; // allow for reseting board while streaming ?
          break;
        case SerialStates.WaitEnding:
        // case States.Writing:
          this.open_close_button.value = i18n.close;
          this.open_close_button.onclick = this.close_handler;
          this.open_close_button.disabled = true;
          this.start_stop_button.value = i18n.stop;
          this.start_stop_button.disabled = true;
          this.reset_board_button.disabled = false;
          break;
        default:
          console.error('unknown state ' + newState);
          break;
      }
    }
    
    private onControl(wsm: WebsocketMessage) {

      var str: string = wsm.data.control;
      
      if (typeof str === 'string') { 

        if (this.control_timeout_ID === undefined) {
          this.control_timeout_ID = setTimeout(() => {
              this.control_timeout_ID = undefined;
              this.board_error.textContent = 'parser error'; // TODO (2) : board_error i18n
              this.board_error.style.display = 'inline';
              log('failed to parse ' + this.control_string);
              console.error('failed to parse ' + this.control_string);
              this.control_string = '';
          }, 2000);
        }

        this.control_string += str;

        var result: RegExpExecArray;
        var regexp = {
          init_message: /((OpenBCI [\w ]+) Board\nSetting ADS1299 Channel Values\n(ADS1299 Device ID: \w+\r\nLIS3DH Device ID: \w+))\r\n\$\$\$/,
          registers_message: /(ID,[^\$]+)\$\$\$/,
          registers_get_message: /(\d\d\d\d\d\d)\$\$\$/,
          is_num: /\d/,
          is_line: /([^\r]+)\r\n/
        };

        do {

          // FIXME : send control_string on timeout if there is no pattern to find (ex : d ? D ? )

          // console.log('1 > ' + this.control_string.replace(/\r/gm,'\\r').replace(/\n/gm,'\\n').replace(/\t/gm,'\\t'));

          if (this.control_string[0] === 'O') {

            result = regexp.init_message.exec(this.control_string);
            if (result !== null) {
              // set IDs
              log('obci > ' + result[1].replace(/\n/gm,' ').replace(/\r/gm,' '));
              document.getElementById('device_ID_' + this.identifier).textContent = ' - ' + result[2] + ' - ' + result[3];
            }
          }
          else if (this.control_string[0] === 'I') {
            result = regexp.registers_message.exec(this.control_string);
            if (result !== null) {
              log('obci > ' + result[1]);
              // TODO (2) : set registers
            }
          }
          else if (regexp.is_num.exec(this.control_string[0])) {
            console.log('ISNUM');
            result = regexp.registers_get_message.exec(this.control_string);
            if (result) {
              // TODO (1) : set channels state
              log('obci > ' + result[1]);
            }
          }
          else {
            result = regexp.is_line.exec(this.control_string);
            if (result) {
              log('obci > ' + result[1]); // TODO (5) : decode and check settings change ack ?
            }
          }

          if (result) { // cut the section
            this.control_string = this.control_string.slice(result[0].length);
            // console.log('CUT > ' + this.control_string.length  + ' - ' + result[0].length );
            if (this.control_string.length === 0) {
              clearTimeout(this.control_timeout_ID);
              this.control_timeout_ID = undefined;
            }
          }
          // else { console.log('no result on ' + this.control_string ); } 

          // console.log('2 > ' + this.control_string);
        } while (result)

      }
      else {
        log('obci > ' + JSON.stringify(str)); // TODO (1) : request decoder
        console.warn('serial unknown oncontrol ' + str + ' m:' + JSON.stringify(str));
      }
    }
    
    private onError(error: Error) {
      console.error(error);
      log(error.toString());
      this.board_error.textContent = error.toString(); // TODO (2) : board_error i18n
      this.board_error.style.display = 'inline';
    }
   
} 

