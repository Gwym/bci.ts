"use strict"

var version = 1;
// use an interface to be warned on missing translations

module I18n {
  export interface Corpus {
    not_implemented: string
    select_source: string
    do_connect: string
    do_disconnect: string
    disconnected: string
    hide_canvas: string
    show_canvas: string
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
    serial_path_hint: string
    serial_path_list: string
    serial_path_list_hint: string
    serial_path_hint_not_found: string
    use_simulator: string
    use_simulator_hint: string
    unknown: string
    board_state: {
      [key: string]: string
      0: string
      1: string
      2: string
      3: string
      4: string
      5: string
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
  select_source: 'Please select a data source',
  do_connect: 'Connect',
  do_disconnect: 'Disconnect',
  disconnected: 'Disconnected',
  hide_canvas: 'Hide canvas',
  show_canvas: 'Show canvas',
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
  serial_path_hint: 'Serial port',
  serial_path_list: '?',
  serial_path_list_hint: 'Get a list of USB serial ports',
  serial_path_hint_not_found: 'None found.',
  use_simulator: 'Simu',
  use_simulator_hint: 'Use board simulator',
  unknown: 'Unknown',
  board_state: {
    0: 'Closed',
    1: 'Opening...',
    2: 'Waiting for board ack...',
    3: 'Ready',
    4: 'Streaming data',
    5: 'Busy...'
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
  select_source: 'Veuillez sélectionner une source de données',
  do_connect: 'Connecter',
  do_disconnect: 'Déconnecter',
  disconnected: 'Déconnecté',
  hide_canvas: 'Cacher le canvas',
  show_canvas: 'Afficher le canvas',
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
  serial_path_hint: 'Port série',
  serial_path_list: '?',
  serial_path_list_hint: 'Obtenir la liste des ports série USB',
  serial_path_hint_not_found: 'Non trouvé.',
  use_simulator: 'Simu',
  use_simulator_hint: 'Utiliser le simulateur',
  unknown: 'Inconnu',
  board_state: {
    0: 'Fermée',
    1: 'Ouverture en cours...',
    2: 'Attente réponse carte...',
    3: 'Prête',
    4: 'Flux de données',
    5: 'Occupée...'
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



