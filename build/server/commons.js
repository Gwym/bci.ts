(function (BlocksTypes) {
    BlocksTypes[BlocksTypes["Worker"] = 0] = "Worker";
    BlocksTypes[BlocksTypes["Serial"] = 1] = "Serial";
    BlocksTypes[BlocksTypes["Persistor"] = 2] = "Persistor";
    BlocksTypes[BlocksTypes["Audio"] = 3] = "Audio";
    BlocksTypes[BlocksTypes["Image"] = 4] = "Image";
    BlocksTypes[BlocksTypes["Video"] = 5] = "Video";
})(exports.BlocksTypes || (exports.BlocksTypes = {}));
var BlocksTypes = exports.BlocksTypes;
;
(function (MessageTypes) {
    MessageTypes[MessageTypes["WebsocketCreate"] = 0] = "WebsocketCreate";
    MessageTypes[MessageTypes["WebsocketClose"] = 1] = "WebsocketClose";
    MessageTypes[MessageTypes["RequestState"] = 2] = "RequestState";
    MessageTypes[MessageTypes["State"] = 3] = "State";
    MessageTypes[MessageTypes["Control"] = 4] = "Control";
    MessageTypes[MessageTypes["Data"] = 5] = "Data";
    MessageTypes[MessageTypes["Error"] = 6] = "Error";
    MessageTypes[MessageTypes["RequestPorts"] = 7] = "RequestPorts";
})(exports.MessageTypes || (exports.MessageTypes = {}));
var MessageTypes = exports.MessageTypes;
;
(function (SerialStates) {
    SerialStates[SerialStates["Closed"] = 0] = "Closed";
    SerialStates[SerialStates["Opening"] = 1] = "Opening";
    SerialStates[SerialStates["WaitingForBoard"] = 2] = "WaitingForBoard";
    SerialStates[SerialStates["Idle"] = 3] = "Idle";
    SerialStates[SerialStates["Streaming"] = 4] = "Streaming";
    SerialStates[SerialStates["WaitEnding"] = 5] = "WaitEnding";
})(exports.SerialStates || (exports.SerialStates = {}));
var SerialStates = exports.SerialStates;
;
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
})(exports.SerialEvents || (exports.SerialEvents = {}));
var SerialEvents = exports.SerialEvents;
;
(function (SerialControls) {
})(exports.SerialControls || (exports.SerialControls = {}));
var SerialControls = exports.SerialControls;
;
(function (PersistorStates) {
    PersistorStates[PersistorStates["Init"] = 0] = "Init";
    PersistorStates[PersistorStates["Closed"] = 1] = "Closed";
    PersistorStates[PersistorStates["Opening"] = 2] = "Opening";
    PersistorStates[PersistorStates["Idle"] = 3] = "Idle";
    PersistorStates[PersistorStates["Streaming"] = 4] = "Streaming";
})(exports.PersistorStates || (exports.PersistorStates = {}));
var PersistorStates = exports.PersistorStates;
;
(function (PersistorEvents) {
    PersistorEvents[PersistorEvents["Open"] = 0] = "Open";
    PersistorEvents[PersistorEvents["OnOpen"] = 1] = "OnOpen";
    PersistorEvents[PersistorEvents["Close"] = 2] = "Close";
    PersistorEvents[PersistorEvents["Error"] = 3] = "Error";
    PersistorEvents[PersistorEvents["Timeout"] = 4] = "Timeout";
    PersistorEvents[PersistorEvents["StreamStart"] = 5] = "StreamStart";
    PersistorEvents[PersistorEvents["StreamStop"] = 6] = "StreamStop";
    PersistorEvents[PersistorEvents["Control"] = 7] = "Control";
})(exports.PersistorEvents || (exports.PersistorEvents = {}));
var PersistorEvents = exports.PersistorEvents;
;
(function (PersistorControls) {
})(exports.PersistorControls || (exports.PersistorControls = {}));
var PersistorControls = exports.PersistorControls;
