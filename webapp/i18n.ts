"use strict"

var version = 1;
// use an interface to be warned on missing translations

module I18n {
  export interface Corpus {
    not_implemented: string
    chrome_app_warn: string
    select_source: string
    do_connect: string
    do_disconnect: string
    disconnected: string,
    hide_canvas: string
    show_canvas: string
    option_select_source: string
    option_local_serial: string
    option_load_file: string
    option_local_store: string
    option_add: string
    option_localhost: string
    option_server: string
    connect_serial_to: string
    connect_to_ws: string
    connect_to_mongodb: string
    connect_to_filedb: string
    sample_per_second: string
    frame_count: string
    frame_miss: string
    start: string
    stop: string
    open: string
    close: string
    unknown: string
    board_state: {
      [key: string]: string
      STATE_CLOSED: string
      STATE_OPENING: string
      STATE_INIT: string
      STATE_IDLE: string
      STATE_STREAMING: string
      STATE_WAIT_ENDING: string
      STATE_WRITING: string
    }
    board_settings: string
    board_settings_button: string
    bsb_get: string
    bsb_get_registers: string
    bsb_set: string
    bsb_reset: string,
    bsb_cancel: string
    adc_input_type_values: [string, string, string, string, string, string, string, string]
    channels: [string, string, string, string, string, string, string, string]
    reset_board: string,
    settings_title: {
      [key: string]: string;
      adc_channel: string,
      adc_disabled: string,
      adc_gain: string,
      adc_input_type: string,
      adc_bias: string,
      adc_SRB2: string,
      adc_SRB1: string,
      adc_impedance_p: string,
      adc_impedance_n: string
    },
    settings_hint: {
      [key: string]: string;
      adc_channel: string,
      adc_disabled: string,
      adc_gain: string,
      adc_input_type: string,
      adc_bias: string,
      adc_SRB2: string,
      adc_SRB1: string,
      adc_impedance_p: string,
      adc_impedance_n: string
    }
  }
}

var i18n_en: I18n.Corpus = {
  not_implemented: 'Not implemented :',
  chrome_app_warn: 'Serial requires application to be launched as a Chrome App.', // TODO (5) : see http://...tuto###
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
}

var i18n_fr: I18n.Corpus = {
  not_implemented: 'Non implementé :',
  chrome_app_warn: "Lancer en tant qu'application Chrome est requis pour utiliser le port USB.", // TODO (5) : Voir http://...tuto###
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
  sample_per_second: 'eps', // échantillons par seconde
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
    adc_impedance_p: 'Impédance de fuite P (voir http://www.ti.com/lit/an/sbaa196/sbaa196.pdf)', // 'de fuite' ? 'sans dérivation' ?
    adc_impedance_n: 'Impédance de fuite N (voir http://www.ti.com/lit/an/sbaa196/sbaa196.pdf)', // 'de fuite' ? 'sans dérivation' ?     
  }
}

var i18n: I18n.Corpus = i18n_en; // current langage selection TODO (2) : dynamic 



