"use strict";
var version = 1;
var i18n_en = {
    not_implemented: 'Not implemented :',
    chrome_app_warn: 'Serial requires application to be launched as a Chrome App.',
    select_source: 'Please select a data source',
    do_connect: 'Connect',
    do_disconnect: 'Disconnect',
    disconnected: 'Disconnected',
    hide_canvas: 'Hide canvas',
    show_canvas: 'Show canvas',
    option_select_source: 'Select a source...',
    option_local_serial: 'Browser serial port : /dev/ttyUSB0',
    option_load_file: 'Load file...',
    option_local_store: 'Browser LocalStore',
    option_add: 'Add source...',
    option_localhost: 'Localhost : ws://127.0.0.1:8080/',
    option_server: 'Server : ws://ws-yenah.rhcloud.com:8000/',
    connect_serial_to: 'Stream serial data to : ',
    connect_to_ws: 'Browser',
    connect_to_mongodb: 'Mongodb',
    connect_to_filedb: 'file',
    sample_per_second: 'sps',
    frame_count: 'samples',
    frame_miss: 'miss',
    start: 'Start',
    stop: 'Stop',
    open: 'Open',
    close: 'Close',
    unknown: 'Unknown',
    board_state: {
        STATE_CLOSED: 'Closed',
        STATE_OPENING: 'Opening...',
        STATE_INIT: 'Waiting for board ack...',
        STATE_IDLE: 'Ready',
        STATE_STREAMING: 'Streaming data',
        STATE_WAIT_ENDING: 'Busy...',
        STATE_WRITING: 'Writing...'
    },
    board_settings: 'Settings : ',
    board_settings_button: 'Settings',
    bsb_get: 'Get channels',
    bsb_get_registers: 'Get registers',
    bsb_set: 'Apply changes',
    bsb_reset: 'Reset to default',
    bsb_cancel: 'Cancel changes',
    adc_input_type_values: ['NORMAL', 'SHORTED', 'BIAS_MEAS', 'MVDD', 'TEMP', 'TESTSIG', 'BIAS_DRP', 'BIAS_DRN'],
    channels: ['Channel 1', 'Channel 2', 'Channel 3', 'Channel 4', 'Channel 5', 'Channel 6', 'Channel 7', 'Channel 8'],
    reset_board: 'Reset board',
    settings_title: {
        adc_channel: 'Channel',
        adc_disabled: 'Disable',
        adc_gain: 'Gain',
        adc_input_type: 'Input type',
        adc_bias: 'Bias',
        adc_SRB2: 'SRB2',
        adc_SRB1: 'SRB1',
        adc_impedance_p: 'Lead-off P',
        adc_impedance_n: 'Lead-off N'
    },
    settings_hint: {
        adc_channel: '',
        adc_disabled: '',
        adc_gain: '',
        adc_input_type: 'ADC channel input source',
        adc_bias: 'Include the channel input in BIAS generation',
        adc_SRB2: 'Connect the channel P input to the SRB2 pin',
        adc_SRB1: 'Disconnect all N inputs from the ADC and connect them to SRB1.',
        adc_impedance_p: 'Lead-off impedance P (see http://www.ti.com/lit/an/sbaa196/sbaa196.pdf)',
        adc_impedance_n: 'Lead-off impedance N (see http://www.ti.com/lit/an/sbaa196/sbaa196.pdf)'
    }
};
var i18n_fr = {
    not_implemented: 'Non implementé :',
    chrome_app_warn: "Lancer en tant qu'application Chrome est requis pour utiliser le port USB.",
    select_source: 'Veuillez sélectionner une source de données',
    do_connect: 'Connecter',
    do_disconnect: 'Déconnecter',
    disconnected: 'Déconnecté',
    hide_canvas: 'Cacher le canvas',
    show_canvas: 'Afficher le canvas',
    option_select_source: 'Sélectionnez une source...',
    option_local_serial: 'Port série via le navigateur : /dev/ttyUSB0',
    option_load_file: 'Charger un fichier...',
    option_local_store: 'LocalStore du navigateur',
    option_add: 'Ajouter une source...',
    option_localhost: 'Localhost : ws://127.0.0.1:8080/',
    option_server: 'Serveur : ws://ws-yenah.rhcloud.com:8000/',
    connect_serial_to: 'Données série vers : ',
    connect_to_ws: 'navigateur',
    connect_to_mongodb: 'Mongodb',
    connect_to_filedb: 'fichier',
    sample_per_second: 'eps',
    frame_count: 'échantillons',
    frame_miss: 'ratés',
    start: 'Démarrer',
    stop: 'Arrêter',
    open: 'Ouvrir',
    close: 'Fermer',
    unknown: 'Inconnu',
    board_state: {
        STATE_CLOSED: 'Fermée',
        STATE_OPENING: 'Ouverture en cours...',
        STATE_INIT: 'Attente réponse carte...',
        STATE_IDLE: 'Prête',
        STATE_STREAMING: 'Flux de données',
        STATE_WAIT_ENDING: 'Occupée...',
        STATE_WRITING: 'Ecriture...'
    },
    board_settings: 'Réglages : ',
    board_settings_button: 'Réglages',
    bsb_get: 'Lire les canaux',
    bsb_get_registers: 'Lire les registres',
    bsb_set: 'Appliquer les changements',
    bsb_reset: 'Valeurs par défaut',
    bsb_cancel: 'Annuler les changements',
    adc_input_type_values: ['NORMAL', 'SHORTED', 'BIAS_MEAS', 'MVDD', 'TEMP', 'TESTSIG', 'BIAS_DRP', 'BIAS_DRN'],
    channels: ['Canal 1', 'Canal 2', 'Canal 3', 'Canal 4', 'Canal 5', 'Canal 6', 'Canal 7', 'Canal 8'],
    reset_board: 'Reset carte',
    settings_title: {
        adc_channel: 'Canal',
        adc_disabled: 'Désactiver',
        adc_gain: 'Gain',
        adc_input_type: "Type d'entrée",
        adc_bias: 'Bias',
        adc_SRB2: 'SRB2',
        adc_SRB1: 'SRB1',
        adc_impedance_p: 'P',
        adc_impedance_n: 'N'
    },
    settings_hint: {
        adc_channel: '',
        adc_disabled: '',
        adc_gain: '',
        adc_input_type: "Source d'entrée du canal",
        adc_bias: "Inclure l'entrée du canal dans la génération du BIAS",
        adc_SRB2: "Connecter l'entrée P du canal à la broche SRB2",
        adc_SRB1: "Déconnecter toutes les entrées N de de l'ADC et les connecter à la broche SRB1",
        adc_impedance_p: 'Impédance de fuite P (voir http://www.ti.com/lit/an/sbaa196/sbaa196.pdf)',
        adc_impedance_n: 'Impédance de fuite N (voir http://www.ti.com/lit/an/sbaa196/sbaa196.pdf)',
    }
};
var i18n = i18n_en;
var BlocksTypes;
(function (BlocksTypes) {
    BlocksTypes[BlocksTypes["Worker"] = 0] = "Worker";
    BlocksTypes[BlocksTypes["Serial"] = 1] = "Serial";
    BlocksTypes[BlocksTypes["Persistor"] = 2] = "Persistor";
    BlocksTypes[BlocksTypes["Audio"] = 3] = "Audio";
    BlocksTypes[BlocksTypes["Image"] = 4] = "Image";
    BlocksTypes[BlocksTypes["Video"] = 5] = "Video";
})(BlocksTypes || (BlocksTypes = {}));
;
var MessageTypes;
(function (MessageTypes) {
    MessageTypes[MessageTypes["WebsocketCreate"] = 0] = "WebsocketCreate";
    MessageTypes[MessageTypes["WebsocketClose"] = 1] = "WebsocketClose";
    MessageTypes[MessageTypes["RequestState"] = 2] = "RequestState";
    MessageTypes[MessageTypes["State"] = 3] = "State";
    MessageTypes[MessageTypes["Control"] = 4] = "Control";
    MessageTypes[MessageTypes["Data"] = 5] = "Data";
    MessageTypes[MessageTypes["Error"] = 6] = "Error";
})(MessageTypes || (MessageTypes = {}));
;
var SerialStates;
(function (SerialStates) {
    SerialStates[SerialStates["Closed"] = 0] = "Closed";
    SerialStates[SerialStates["Opening"] = 1] = "Opening";
    SerialStates[SerialStates["WaitingForBoard"] = 2] = "WaitingForBoard";
    SerialStates[SerialStates["Idle"] = 3] = "Idle";
    SerialStates[SerialStates["Streaming"] = 4] = "Streaming";
    SerialStates[SerialStates["WaitEnding"] = 5] = "WaitEnding";
})(SerialStates || (SerialStates = {}));
;
var SerialEvents;
(function (SerialEvents) {
    SerialEvents[SerialEvents["Open"] = 0] = "Open";
    SerialEvents[SerialEvents["Close"] = 1] = "Close";
    SerialEvents[SerialEvents["GetPut"] = 2] = "GetPut";
    SerialEvents[SerialEvents["StreamStart"] = 3] = "StreamStart";
    SerialEvents[SerialEvents["StreamStop"] = 4] = "StreamStop";
    SerialEvents[SerialEvents["OnOpen"] = 5] = "OnOpen";
    SerialEvents[SerialEvents["OnControl"] = 6] = "OnControl";
    SerialEvents[SerialEvents["OnEndOfSection"] = 7] = "OnEndOfSection";
    SerialEvents[SerialEvents["WriteNext"] = 8] = "WriteNext";
    SerialEvents[SerialEvents["Error"] = 9] = "Error";
    SerialEvents[SerialEvents["Timeout"] = 10] = "Timeout";
})(SerialEvents || (SerialEvents = {}));
;
var SerialControls;
(function (SerialControls) {
})(SerialControls || (SerialControls = {}));
;
var PersistorStates;
(function (PersistorStates) {
    PersistorStates[PersistorStates["Init"] = 0] = "Init";
    PersistorStates[PersistorStates["Closed"] = 1] = "Closed";
    PersistorStates[PersistorStates["Opening"] = 2] = "Opening";
    PersistorStates[PersistorStates["Idle"] = 3] = "Idle";
    PersistorStates[PersistorStates["Streaming"] = 4] = "Streaming";
})(PersistorStates || (PersistorStates = {}));
;
var PersistorEvents;
(function (PersistorEvents) {
    PersistorEvents[PersistorEvents["Open"] = 0] = "Open";
    PersistorEvents[PersistorEvents["OnOpen"] = 1] = "OnOpen";
    PersistorEvents[PersistorEvents["Close"] = 2] = "Close";
    PersistorEvents[PersistorEvents["Error"] = 3] = "Error";
    PersistorEvents[PersistorEvents["Timeout"] = 4] = "Timeout";
    PersistorEvents[PersistorEvents["StreamStart"] = 5] = "StreamStart";
    PersistorEvents[PersistorEvents["StreamStop"] = 6] = "StreamStop";
    PersistorEvents[PersistorEvents["Control"] = 7] = "Control";
})(PersistorEvents || (PersistorEvents = {}));
;
var PersistorControls;
(function (PersistorControls) {
})(PersistorControls || (PersistorControls = {}));
"use strict";
class UiSerial {
    constructor(id, options) {
        this.command = {
            resetBoard: 'v',
            getChannelsSettings: 'D',
            resetChannelsSettings: 'd',
            getRegistersSettings: '?'
        };
        this.control_string = '';
        this._board_virtual_disabled = true;
        this._settings_virtual_disabled = true;
        this._settings_string = '';
        this.open_handler = () => {
            this.open_close_button.disabled = true;
            worker.postMessage({
                target: this.identifier, messageType: MessageTypes.Control, event: SerialEvents.Open, data: {}
            });
        };
        this.close_handler = () => {
            this.open_close_button.disabled = true;
            worker.postMessage({
                target: this.identifier, messageType: MessageTypes.Control, event: SerialEvents.Close, data: {}
            });
        };
        this.stop_handler = () => {
            this.start_stop_button.disabled = true;
            worker.postMessage({
                target: this.identifier, messageType: MessageTypes.Control, event: SerialEvents.StreamStop, data: { connect_to_ws: false }
            });
            system.unregisterAnim(bci_plot.redraw);
        };
        this.start_handler = () => {
            this.open_close_button.disabled = true;
            worker.postMessage({
                target: this.identifier, messageType: MessageTypes.Control, event: SerialEvents.StreamStart, data: { connect_to_ws: true }
            });
            this.performance_frame_count = 0;
            this.performance_start_time = performance.now();
            system.registerAnim(bci_plot.redraw);
        };
        this.identifier = id;
        this.init(options);
    }
    get board_virtual_disabled() { return this._board_virtual_disabled; }
    set board_virtual_disabled(b) {
        this._board_virtual_disabled = b;
        this.bsb_set.disabled = this._settings_virtual_disabled || this._board_virtual_disabled;
    }
    get settings_virtual_disabled() { return this._settings_virtual_disabled; }
    set settings_virtual_disabled(b) {
        this._settings_virtual_disabled = b;
        this.bsb_set.disabled = this._settings_virtual_disabled || this._board_virtual_disabled;
    }
    get settings_string() { return this._settings_string; }
    set settings_string(s) {
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
    init(options) {
        var container = document.getElementById('blocks-control');
        var e = document.createElement('span');
        var h1 = document.createElement('h1');
        h1.textContent = (options && options.name ? options.name : i18n.unknown);
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
        this.board_state.id = 'board_state';
        e.appendChild(this.board_state);
        this.board_error = document.createElement('span');
        this.board_error.id = 'board_error';
        this.board_error.addEventListener('click', (e) => { this.board_error.textContent = ''; this.board_error.style.display = 'none'; });
        e.appendChild(this.board_error);
        this.board_settings_button = document.createElement('button');
        this.board_settings_button.className = 'serial_button';
        this.board_settings_button.textContent = String.fromCharCode(9881) + ' ' + i18n.board_settings_button;
        this.board_settings_button.onclick = () => { this.board_settings.style.display = this.board_settings.style.display === 'block' ? 'none' : 'block'; };
        e.appendChild(this.board_settings_button);
        this.reset_board_button = document.createElement('button');
        this.reset_board_button.className = 'serial_button';
        this.reset_board_button.textContent = i18n.reset_board;
        this.reset_board_button.onclick = () => {
            console.log('reset board (' + this.command.resetBoard + ')');
            worker.postMessage({
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
            worker.postMessage({
                target: this.identifier, messageType: MessageTypes.Control, event: SerialEvents.GetPut, data: this.command.getChannelsSettings
            });
        };
        caption.appendChild(this.bsb_get);
        this.bsb_reset = document.createElement('button');
        this.bsb_reset.className = 'bsb_button';
        this.bsb_reset.textContent = i18n.bsb_reset;
        this.bsb_reset.onclick = () => {
            console.log('reset settings (d)');
            worker.postMessage({
                target: this.identifier, messageType: MessageTypes.Control, event: SerialEvents.GetPut, data: this.command.resetChannelsSettings
            });
        };
        caption.appendChild(this.bsb_reset);
        this.bsb_set = document.createElement('button');
        this.bsb_set.className = 'bsb_button bsb_set';
        this.bsb_set.textContent = i18n.bsb_set;
        this.bsb_set.onclick = () => { this.applySettingsChanges(); };
        caption.appendChild(this.bsb_set);
        this.bsb_cancel = document.createElement('button');
        this.bsb_cancel.className = 'bsb_button bsb_cancel';
        this.bsb_cancel.textContent = i18n.bsb_cancel;
        this.bsb_cancel.disabled = true;
        this.bsb_cancel.onclick = () => { this.restoreOriginalSettings(); };
        caption.appendChild(this.bsb_cancel);
        this.bsb_get_registers = document.createElement('button');
        this.bsb_get_registers.className = 'bsb_button bsb_get_registers';
        this.bsb_get_registers.textContent = i18n.bsb_get_registers;
        this.bsb_get_registers.onclick = () => {
            console.log('get settings (?)');
            worker.postMessage({
                target: this.identifier, messageType: MessageTypes.Control, event: SerialEvents.GetPut, data: this.command.getRegistersSettings
            });
        };
        caption.appendChild(this.bsb_get_registers);
        table.appendChild(caption);
        var thead = document.createElement('thead');
        this.settings_tbody = document.createElement('tbody');
        this.settings_tbody.id = 'board_settings_' + this.identifier;
        this.setChannelConfiguration(this.settings_tbody, []);
        var tr = document.createElement('tr');
        var t;
        ['adc_channel', 'adc_disabled', 'adc_gain', 'adc_input_type', 'adc_bias', 'adc_SRB2', 'adc_SRB1', 'adc_impedance_p', 'adc_impedance_n'].forEach(function (field) {
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
    }
    handler(m) {
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
    setChannelConfiguration(tbody, config) {
        console.log('configuration : ');
        console.log(config);
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }
        var tr;
        var t;
        var checkbox;
        var o;
        var select;
        var checkbox_getter = function () { return this.checked ? '1' : '0'; };
        var checkbox_setter = function (b) { this.checked = b === '0' || !b ? false : true; };
        for (var c = 0; c < 8; c++) {
            if (!config[c]) {
                config[c] = [0, 6, 0, 1, 1, 0, 0, 0];
            }
            tr = document.createElement('tr');
            t = document.createElement('td');
            t.textContent = i18n.channels[c];
            tr.appendChild(t);
            t = document.createElement('td');
            checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = (config[c][0] === 0 ? false : true);
            checkbox.onchange = (e) => { this.refreshSetOrCancel(e); };
            Object.defineProperty(checkbox, 'value', { get: checkbox_getter, set: checkbox_setter });
            checkbox.dataset['original_value'] = checkbox.value;
            t.appendChild(checkbox);
            tr.appendChild(t);
            t = document.createElement('td');
            select = document.createElement('select');
            ['1', '2', '4', '6', '8', '12', '24'].forEach(function (element, index) {
                o = document.createElement('option');
                o.textContent = element;
                o.value = index.toString();
                select.appendChild(o);
            });
            select.selectedIndex = config[c][1];
            select.onchange = (e) => { this.refreshSetOrCancel(e); };
            select.dataset['original_value'] = select.value;
            t.appendChild(select);
            tr.appendChild(t);
            t = document.createElement('td');
            select = document.createElement('select');
            i18n.adc_input_type_values.forEach(function (element, index) {
                o = document.createElement('option');
                o.textContent = element;
                o.value = index.toString();
                select.appendChild(o);
            });
            select.selectedIndex = config[c][2];
            select.onchange = (e) => { this.refreshSetOrCancel(e); };
            select.dataset['original_value'] = select.value;
            t.appendChild(select);
            tr.appendChild(t);
            for (var i = 3; i < 8; i++) {
                t = document.createElement('td');
                checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = (config[c][i] === 0 ? false : true);
                checkbox.onchange = (e) => { this.refreshSetOrCancel(e); };
                Object.defineProperty(checkbox, 'value', { get: checkbox_getter, set: checkbox_setter });
                checkbox.dataset['original_value'] = checkbox.value;
                t.appendChild(checkbox);
                tr.appendChild(t);
            }
            tbody.appendChild(tr);
        }
    }
    refreshSetOrCancel(e) {
        var c;
        var i;
        var channels;
        var settings;
        var input;
        var value_changed;
        var channel_str;
        var board_str = '';
        channels = this.settings_tbody.children;
        for (c = 0; c < channels.length; c++) {
            settings = channels.item(c).children;
            value_changed = false;
            channel_str = 'x' + (c + 1);
            for (i = 1; i < 7; i++) {
                input = settings[i].firstChild;
                if (input.dataset['original_value'] !== input.value) {
                    value_changed = true;
                }
                channel_str += input.value;
            }
            if (value_changed) {
                board_str += channel_str + 'X';
            }
            value_changed = false;
            channel_str = 'z' + (c + 1);
            for (i = 7; i < 9; i++) {
                input = settings[i].firstChild;
                if (input.dataset['original_value'] !== input.value) {
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
    applySettingsChanges() {
        worker.postMessage({
            target: this.identifier, messageType: MessageTypes.Control, event: SerialEvents.GetPut, data: this.settings_string
        });
        this.settings_string = '';
        var c;
        var i;
        var settings;
        var input;
        var channels = this.settings_tbody.children;
        for (c = 0; c < channels.length; c++) {
            settings = channels.item(c).children;
            for (i = 1; i < 9; i++) {
                input = settings.item(i).firstChild;
                if (input.value !== input.dataset['original_value']) {
                    input.dataset['original_value'] = input.value;
                }
            }
        }
    }
    restoreOriginalSettings() {
        console.log('restoreOriginalSettings > settings_string:' + this.settings_string);
        this.settings_string = '';
        var c;
        var i;
        var settings;
        var input;
        var channels = this.settings_tbody.children;
        for (c = 0; c < channels.length; c++) {
            settings = channels.item(c).children;
            for (i = 1; i < 9; i++) {
                input = settings.item(i).firstChild;
                if (input.value !== input.dataset['original_value']) {
                    input.value = input.dataset['original_value'];
                }
            }
        }
    }
    onData(m) {
        this.frame_count.textContent = (this.performance_frame_count++).toString();
        this.fps.textContent = (1000 * this.performance_frame_count / (performance.now() - this.performance_start_time)).toFixed(2);
        bci_data.feed(m.data.samples);
    }
    onState(m) {
        var newState = m.data.state;
        this.board_state.textContent = i18n.board_state[newState];
        this.board_state.className = newState.toString();
        if (newState !== SerialStates.Idle) {
            this.bsb_get.disabled = true;
            this.bsb_reset.disabled = true;
            this.board_virtual_disabled = true;
            this.bsb_get_registers.disabled = true;
        }
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
                this.open_close_button.value = i18n.close;
                this.open_close_button.onclick = this.close_handler;
                this.open_close_button.disabled = false;
                this.start_stop_button.value = i18n.start;
                this.start_stop_button.onclick = this.start_handler;
                this.start_stop_button.disabled = false;
                this.reset_board_button.disabled = false;
                this.bsb_get.disabled = false;
                this.board_virtual_disabled = false;
                this.bsb_reset.disabled = false;
                this.bsb_get_registers.disabled = false;
                break;
            case SerialStates.Streaming:
                this.open_close_button.value = i18n.close;
                this.open_close_button.disabled = true;
                this.start_stop_button.value = i18n.stop;
                this.start_stop_button.onclick = this.stop_handler;
                this.start_stop_button.disabled = false;
                this.reset_board_button.disabled = false;
                break;
            case SerialStates.WaitEnding:
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
    onControl(wsm) {
        var str = wsm.data.control;
        if (typeof str === 'string') {
            if (this.control_timeout_ID === undefined) {
                this.control_timeout_ID = setTimeout(() => {
                    this.control_timeout_ID = undefined;
                    this.board_error.textContent = 'parser error';
                    this.board_error.style.display = 'inline';
                    log('failed to parse ' + this.control_string);
                    console.error('failed to parse ' + this.control_string);
                    this.control_string = '';
                }, 2000);
            }
            this.control_string += str;
            var result;
            var regexp = {
                init_message: /((OpenBCI [\w ]+) Board\nSetting ADS1299 Channel Values\n(ADS1299 Device ID: \w+\r\nLIS3DH Device ID: \w+))\r\n\$\$\$/,
                registers_message: /(ID,[^\$]+)\$\$\$/,
                registers_get_message: /(\d\d\d\d\d\d)\$\$\$/,
                is_num: /\d/,
                is_line: /([^\r]+)\r\n/
            };
            do {
                if (this.control_string[0] === 'O') {
                    result = regexp.init_message.exec(this.control_string);
                    if (result !== null) {
                        log('obci > ' + result[1].replace(/\n/gm, ' ').replace(/\r/gm, ' '));
                        document.getElementById('device_ID_' + this.identifier).textContent = ' - ' + result[2] + ' - ' + result[3];
                    }
                }
                else if (this.control_string[0] === 'I') {
                    result = regexp.registers_message.exec(this.control_string);
                    if (result !== null) {
                        log('obci > ' + result[1]);
                    }
                }
                else if (regexp.is_num.exec(this.control_string[0])) {
                    console.log('ISNUM');
                    result = regexp.registers_get_message.exec(this.control_string);
                    if (result) {
                        log('obci > ' + result[1]);
                    }
                }
                else {
                    result = regexp.is_line.exec(this.control_string);
                    if (result) {
                        log('obci > ' + result[1]);
                    }
                }
                if (result) {
                    this.control_string = this.control_string.slice(result[0].length);
                    if (this.control_string.length === 0) {
                        clearTimeout(this.control_timeout_ID);
                        this.control_timeout_ID = undefined;
                    }
                }
            } while (result);
        }
        else {
            log('obci > ' + JSON.stringify(str));
            console.warn('serial unknown oncontrol ' + str + ' m:' + JSON.stringify(str));
        }
    }
    onError(error) {
        console.error(error);
        log(error.toString());
        this.board_error.textContent = error.toString();
        this.board_error.style.display = 'inline';
    }
}
"use strict";
class UiPersistor {
    constructor(id, options) {
        this.type = BlocksTypes.Persistor;
        this.identifier = id;
    }
    handler(m) {
        console.log('TODO ' + m);
    }
}
'use strict';
var buffer_size = 1024;
var bci_plot;
var bci_data;
window.addEventListener('load', function () {
    var canvas_container = document.getElementById('canvas_container');
    bci_data = new DataCollector(8, buffer_size, true);
    bci_plot = new CanvasPlotter(canvas_container, bci_data);
});
class CanvasPlotter {
    constructor(container, datacoll) {
        this.redraw = () => {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this._drawGrid();
            this._drawData();
            this._drawFFT(this.dataset.fftsets);
        };
        if (datacoll.datasets.length > 8) {
            throw "CanvasPlotter can only manage 8 channels";
        }
        this.dataset = datacoll;
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext("2d");
        this.canvas.width = 1800;
        this.canvas.height = CanvasPlotter.GRAPH_HEIGHT * 2 * this.dataset.datasets.length;
        container.appendChild(this.context.canvas);
        this._drawGrid();
    }
    _drawGrid() {
        var ctx = this.context;
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = '#C0C0C0';
        for (var x = 0; x < this.canvas.width; x += 50) {
            ctx.beginPath(), ctx.moveTo(x, 0), ctx.lineTo(x, this.canvas.height), ctx.stroke();
        }
        for (var y = 0; y < this.canvas.height; y += 50) {
            ctx.beginPath(), ctx.moveTo(0, y), ctx.lineTo(this.canvas.width, y), ctx.stroke();
        }
    }
    _drawData() {
        var ctx = this.context;
        var t;
        ctx.lineWidth = 1;
        for (var c = 0; c < this.dataset.datasets.length; c++) {
            var data = this.dataset.datasets[c].data;
            var max_value = this.dataset.datasets[c].max_value;
            var write_position = this.dataset.write_position;
            ctx.save();
            t = CanvasPlotter.transform[c];
            ctx.setTransform(t.scaleX, 0, 0, t.scaleY, t.dx, t.dy);
            ctx.strokeStyle = CanvasPlotter.axis_color[c];
            ctx.beginPath(), ctx.moveTo(0, 0), ctx.lineTo(data.length, 0), ctx.stroke();
            ctx.save();
            ctx.setTransform(t.scaleX, 0, 0, -t.scaleY / max_value * CanvasPlotter.GRAPH_HEIGHT, t.dx, t.dy);
            ctx.strokeStyle = CanvasPlotter.signal_color[c];
            ctx.beginPath();
            ctx.moveTo(0, data[0]);
            for (var x = 1; x < data.length; x++) {
                ctx.lineTo(x, data[x]);
            }
            ctx.stroke();
            ctx.strokeStyle = CanvasPlotter.axis_color[c];
            ctx.beginPath(), ctx.moveTo(write_position, -max_value), ctx.lineTo(write_position, max_value), ctx.stroke();
            ctx.restore();
            ctx.fillStyle = CanvasPlotter.signal_color[c];
            ctx.fillText(max_value.toString(), 0, CanvasPlotter.GRAPH_HEIGHT - 2);
            if (write_position > 0)
                ctx.fillText(data[write_position - 1].toString(), write_position, 10 - CanvasPlotter.GRAPH_HEIGHT);
            ctx.restore();
        }
    }
    _drawFFT(fftset) {
        var ctx = this.context;
        var t;
        for (var c = 0; c < fftset.length; c++) {
            ctx.save();
            t = CanvasPlotter.transform[c];
            ctx.setTransform(t.scaleX, 0, 0, -t.scaleY / fftset[c].maxre * CanvasPlotter.GRAPH_HEIGHT * 2, t.dx + buffer_size + 20, t.dy + CanvasPlotter.GRAPH_HEIGHT);
            ctx.strokeStyle = CanvasPlotter.axis_color[c];
            ctx.beginPath(), ctx.moveTo(0, 0), ctx.lineTo(fftset[c].length, 0), ctx.stroke();
            ctx.save();
            ctx.strokeStyle = CanvasPlotter.signal_color[c];
            ctx.beginPath();
            ctx.moveTo(0, fftset[c].re[0]);
            for (var x = 1; x < fftset[c].re.length / 2; x++) {
                ctx.lineTo(x, fftset[c].re[x]);
            }
            ctx.stroke();
            ctx.restore();
            ctx.restore();
        }
    }
}
CanvasPlotter.GRAPH_HEIGHT = 50;
CanvasPlotter.transform = [
    { scaleX: 1, scaleY: 1, dx: 0, dy: 50 },
    { scaleX: 1, scaleY: 1, dx: 0, dy: 150 },
    { scaleX: 1, scaleY: 1, dx: 0, dy: 250 },
    { scaleX: 1, scaleY: 1, dx: 0, dy: 350 },
    { scaleX: 1, scaleY: 1, dx: 0, dy: 450 },
    { scaleX: 1, scaleY: 1, dx: 0, dy: 550 },
    { scaleX: 1, scaleY: 1, dx: 0, dy: 650 },
    { scaleX: 1, scaleY: 1, dx: 0, dy: 750 }
];
CanvasPlotter.signal_color = [
    '#FF4444',
    '#44FF44',
    '#4444FF',
    "#FF44FF",
    '#44FFFF',
    '#FFFF44',
    '#4444FF',
    "#FF44FF"
];
CanvasPlotter.axis_color = [
    '#FFAAAA',
    '#AAFFAA',
    '#AAAAFF',
    "#FFAAFF",
    '#AAFFFF',
    '#FFFFAA',
    '#AAAAFF',
    "#FFAAFF"
];
class DataCollector {
    constructor(channel_count, buf_len, calculate_fft) {
        this.calc_fft = false;
        this.write_position = 0;
        this.datasets = [];
        this.fftsets = [];
        this.write_marker = 0;
        this.calc_fft = calculate_fft;
        this.buffer_length = buf_len;
        for (var c = 0; c < channel_count; c++) {
            this.datasets[c] = { data: new Int32Array(buf_len), max_value: 0 };
            if (this.calc_fft) {
                this.fftsets[c] = { length: buf_len, re: new Int32Array(buf_len), im: new Int32Array(buf_len) };
            }
        }
    }
    feed(frame) {
        for (var c = 0; c < this.datasets.length; c++) {
            this.datasets[c].data[this.write_marker] = frame[c];
            this.datasets[c].max_value = Math.max(Math.abs(frame[c]), this.datasets[c].max_value);
        }
        this.write_marker++;
        if (this.write_marker === this.buffer_length) {
            this.write_marker = 0;
            for (var c = 0; c < this.datasets.length; c++) {
                this.datasets[c].max_value = 0;
            }
            if (this.calc_fft) {
                for (var c = 0; c < this.fftsets.length; c++) {
                    this.fftsets[c].re.set(this.datasets[c].data);
                    fft(1, this.fftsets[c].re.length, this.fftsets[c].re, this.fftsets[c].im);
                    var max = 0;
                    for (var i = 0; i < this.fftsets[c].re.length / 2; i++) {
                        this.fftsets[c].re[i] = Math.abs(this.fftsets[c].re[i]);
                        max = Math.max(max, this.fftsets[c].re[i]);
                    }
                    this.fftsets[c].maxre = max;
                }
            }
        }
        this.write_position = this.write_marker;
    }
}
var fft = function (Ind, Npair, Ar, Ai) {
    var Pi = Math.PI;
    var Num1, Num2, i, j, k, L;
    var m, Le, Le1;
    var Tr, Ti, Ur, Ui, Xr, Xi, Wr, Wi, Ip;
    function isPwrOf2(n) {
        var p = -1;
        for (p = 2; p < 13; p++) {
            if (Math.pow(2, p) === n) {
                return p;
            }
        }
        return -1;
    }
    m = isPwrOf2(Npair);
    if (m < 0) {
        alert("Npair must be power of 2 from 4 to 4096");
        return;
    }
    Num1 = Npair - 1;
    Num2 = Npair / 2;
    if (Ind < 0) {
        for (i = 0; i < Npair; i++) {
            Ai[i] *= -1;
        }
    }
    j = 0;
    for (i = 0; i < Num1; i++) {
        if (i < j) {
            Tr = Ar[j];
            Ti = Ai[j];
            Ar[j] = Ar[i];
            Ai[j] = Ai[i];
            Ar[i] = Tr;
            Ai[i] = Ti;
        }
        k = Num2;
        while (k < j + 1) {
            j = j - k;
            k = k / 2;
        }
        j = j + k;
    }
    Le = 1;
    for (L = 1; L <= m; L++) {
        Le1 = Le;
        Le += Le;
        Ur = 1;
        Ui = 0;
        Wr = Math.cos(Pi / Le1);
        Wi = -Math.sin(Pi / Le1);
        for (j = 1; j <= Le1; j++) {
            for (i = j - 1; i <= Num1; i += Le) {
                Ip = i + Le1;
                Tr = Ar[Ip] * Ur - Ai[Ip] * Ui;
                Ti = Ar[Ip] * Ui + Ai[Ip] * Ur;
                Ar[Ip] = Ar[i] - Tr;
                Ai[Ip] = Ai[i] - Ti;
                Ar[i] = Ar[i] + Tr;
                Ai[i] = Ai[i] + Ti;
            }
            Xr = Ur * Wr - Ui * Wi;
            Xi = Ur * Wi + Ui * Wr;
            Ur = Xr;
            Ui = Xi;
        }
    }
    if (Ind < 0) {
        for (i = 0; i < Npair; i++) {
            Ai[i] *= -1;
        }
    }
    else {
        for (i = 0; i < Npair; i++) {
            Ar[i] /= Npair;
            Ai[i] /= Npair;
        }
    }
};
"use strict";
const env = {
    websocketPath: 'ws://127.0.0.1:8080/'
};
var worker;
var Core;
(function (Core) {
    class System {
        constructor() {
            this.redrawers = [];
            this.step = (timestamp) => {
                for (var r in this.redrawers) {
                    this.redrawers[r]();
                }
                this.anim_frame_request_id = requestAnimationFrame(this.step);
            };
        }
        registerAnim(redrawer) {
            this.redrawers.push(redrawer);
            if (this.anim_frame_request_id === undefined)
                this.anim_frame_request_id = requestAnimationFrame(this.step);
        }
        unregisterAnim(redrawer) {
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
    }
    Core.System = System;
})(Core || (Core = {}));
var system = new Core.System();
var appTitle = document.title;
var text_console;
var log;
window.addEventListener('load', function () {
    text_console = document.getElementById('text_console');
    text_console.addEventListener('dblclick', function (e) { text_console.value = ''; });
    log = function (s) { var d = new Date(); text_console.value = d.toLocaleTimeString() + ':' + d.getMilliseconds() + ' > ' + s + '\n' + text_console.value; };
    var serial = new UiSerial(BlocksTypes.Serial, {});
    var persistor = new UiPersistor(BlocksTypes.Persistor, {});
    Ui.setStateDisconnected();
    var canvas_state_button = document.getElementById('canvas-state');
    canvas_state_button.onclick = function () {
        var canvas_container = document.getElementById('canvas_container');
        if (canvas_container.style.display === 'none') {
            canvas_container.style.display = 'block';
            canvas_state_button.textContent = i18n.hide_canvas;
        }
        else {
            canvas_container.style.display = 'none';
            canvas_state_button.textContent = i18n.show_canvas;
        }
    };
    canvas_state_button.textContent = i18n.hide_canvas;
    var path = env.websocketPath;
    log('Connecting websocket ' + path);
    worker = new Worker(window.URL.createObjectURL(new Blob([document.getElementById('bci_worker').textContent], { type: "text/javascript" })));
    worker.onerror = function (e) {
        console.error(e);
    };
    worker.onmessage = function (e) {
        var message = e.data;
        if (message.messageType === MessageTypes.Error) {
            log('websocket error ' + e);
            console.error(message.data);
        }
        if (message.websocketLog) {
            log('websocket > ' + message.websocketLog);
            return;
        }
        if (message.target === BlocksTypes.Serial) {
            serial.handler(message);
        }
        else if (message.target === BlocksTypes.Persistor) {
            persistor.handler(message);
        }
        else if (message.target === BlocksTypes.Worker) {
            if (message.messageType === MessageTypes.WebsocketClose) {
                log('websocket close code:' + message.data.code + ' reason:' + message.data.reason);
                worker.terminate();
                Ui.setStateDisconnected();
                Ui.hidePanel();
            }
            else if (message.messageType === MessageTypes.WebsocketCreate) {
                Ui.setStateConnected();
                worker.postMessage({ target: BlocksTypes.Serial, messageType: MessageTypes.RequestState, data: {} });
                worker.postMessage({ target: BlocksTypes.Persistor, messageType: MessageTypes.RequestState, data: {} });
            }
            else {
                console.error(new Error('UnknowMessageType ' + message.messageType));
            }
        }
        else {
            console.error('dispatch > Invalid websocketMessage :');
            console.log(message);
        }
    };
    worker.postMessage({ target: BlocksTypes.Worker, messageType: MessageTypes.WebsocketCreate, data: { path: path } });
});
var Ui;
(function (Ui) {
    function setStateConnected() {
        document.title = appTitle + ' - ' + env.websocketPath;
    }
    Ui.setStateConnected = setStateConnected;
    function setStateDisconnected() {
        document.title = appTitle + ' - ' + i18n.disconnected;
    }
    Ui.setStateDisconnected = setStateDisconnected;
    function showAuthModal() {
        function listener() {
            worker.postMessage({
                action: 'send',
                data: {
                    id: document.getElementById('user-id').value,
                    pwd: document.getElementById('user-pwd').value
                }
            });
            document.getElementById('form-auth').removeEventListener('submit', listener);
            document.getElementById('panel-auth').style.display = 'none';
            return false;
        }
        document.getElementById('form-auth').addEventListener('submit', listener);
        document.getElementById('panel-auth').style.display = 'block';
    }
    Ui.showAuthModal = showAuthModal;
    function hidePanel() {
        var e = document.getElementById('blocks-control');
        while (e.firstChild) {
            e.removeChild(e.firstChild);
        }
    }
    Ui.hidePanel = hidePanel;
})(Ui || (Ui = {}));
