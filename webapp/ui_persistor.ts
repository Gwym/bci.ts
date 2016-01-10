"use strict"

/// <reference path="common.ts" />
/// <reference path="ui_core.ts" />

class UiPersistor implements MessageConsumer {
  identifier: BlocksTypes;
  type = BlocksTypes.Persistor;
  api: { [key: string]: (arg: any) => void }
  constructor(id: BlocksTypes, options: {}) {

    this.identifier = id;
  }
  
  handler(m: any) {
    console.log('TODO ' + m);
  }
}