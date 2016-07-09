if (!this.___alexnorequire) {
	var GameStructureCodes = require("./GameStructureCodes").GameStructureCodes;
	var TreeNode = require("./Tree").TreeNode;
	var util = require("util");
	var CustomMessageManager = require("./CustomMessageManager").CustomMessageManager;
}
function HandlerBridge() {/*msg codes here*/}
HandlerBridge.cmcInformClientId = "i";
HandlerBridge.cmcInitPackage = "p";
HandlerBridge.prototype.receiveMsg = function(msg) {}
function HandlerBridgeServerSide() {
	this.customMessageManager = new CustomMessageManager();
	this.customMessageManager.registerMessage(HandlerBridge.cmcInformClientId);
	this.customMessageManager.registerMessage(HandlerBridge.cmcInitPackage);
}
HandlerBridgeServerSide.prototype.informClientId = function(hid) {
  this.customMessageManager.triggerMessage(HandlerBridge.cmcInformClientId, hid);
}
HandlerBridgeServerSide.prototype.clientDisconnected = function(hid) {
	var serverBehavior = this["serverBehavior"];
	serverBehavior.serverClientDisconnected.apply(serverBehavior, arguments);
}
HandlerBridgeServerSide.prototype.sendCustomMessage = function(locationStr, msgCode, msg) {
	var sendMessage = msgCode + msg;
	this["serverHandlerLink"].sendToClient(locationStr, sendMessage);
}
HandlerBridgeServerSide.prototype.sendInitPackage = function(locationStr, msg) {
	this.sendCustomMessage(locationStr, HandlerBridge.cmcInitPackage, msg);
}
HandlerBridgeServerSide.prototype.receiveMsg = function(msg) {
   var c = msg.charAt(0);
   if (c == "{") {//is JSON
   		//util.log("receiveMsg: "+msg);
     var o = JSON.parse(msg);
     this["gameHandler"].receiveAndPassUpdate(o);
   } else {
   	   this.customMessageManager.triggerMessage(c, msg.slice(1));
   	 //this.gameStructure.trigger(msg, GameStructureCodes.SERVERGOTCUSTOMMSG, undefined, this.gameStructure);
   }
}
HandlerBridgeServerSide.prototype.sendUpdate = function(sendable, difObj) {
	throw new Error("deprecated");
	sendable.send(JSON.stringify(difObj));
}
HandlerBridgeServerSide.destinationLogicReplacer = function(key, value) {
  var obj = this[key];

  var shortLoc;
  if (obj && obj.destination) {
    var selfLoc = JSON.stringify(obj.treeLocation);
    var recipLoc = clientLocationStr;
    var shouldSend = obj.destination.checkIfSend(selfLoc, recipLoc);
    if (!shouldSend) return undefined;
  	
  }

  return value;
}
HandlerBridgeServerSide.prototype.sendUpdateToAllClients = function(difObj) {
	var difObj = this["gameHandler"].pullSendstate();
	this.sendObjectToAllClients(difObj);
	difObj.clear();
}
HandlerBridgeServerSide.prototype.sendObjectToAllClients = function(obj) {
	var sendFunction = function(sendable, clientLocationStr) {
		var msg = JSON.stringify(difObj, HandlerBridgeServerSide.destinationLogicReplacer);
		util.log("sendObjToAllClients: "+msg);
		sendable.send(msg);
	}
	this["serverHandlerLink"].sendToAllClientsCallback(sendFunction);
}
HandlerBridgeServerSide.prototype.sendCustomMessage = function(sendable, msg) {
	sendable.send(msg);
}
HandlerBridgeServerSide.prototype.sendToClient = function() {
	var shl = this["serverHandlerLink"];
	shl.sendToClient.apply(shl, arguments);
}

//------HandlerBridgeClientSide
function HandlerBridgeClientSide() {
	this.customMessageManager = new CustomMessageManager();
	this.customMessageManager.registerMessage(HandlerBridge.cmcInformClientId);
	this.customMessageManager.registerMessage(HandlerBridge.cmcInitPackage);

	this.customMessageManager.subscribeToMessage(HandlerBridge.cmcInformClientId, this.informClientId.bind(this));

}
HandlerBridgeClientSide.prototype.subscribeToInitPackage = function(fn) {
	this.customMessageManager.subscribeToMessage(HandlerBridge.cmcInitPackage, fn);
}
HandlerBridgeClientSide.prototype.informClientId = function(id) {
	this["clientBehavior"].setMyId(id);
}
HandlerBridgeClientSide.prototype.receiveMsg = function(msg) {
	var c = msg.charAt(0);
	if (c == "{") {
		var o = JSON.parse(msg);
		this.gameHandler.receiveUpdate(o);
	} else {
		this.customMessageManager.triggerMessage(c, msg.slice(1));
	}
	/*
	var c = msg.charAt(0);
	if (c == "{") { //is JSON
		var o = JSON.parse(msg);
		this.gameHandler.receiveUpdate(o);
	} else {
		this.gameStructure.trigger(msg, GameStructureCodes.CLIENTGOTCUSTOMMSG, undefined, this.gameStructure);
	}
	*/
}
/*
HandlerBridgeClientSide.prototype.sendCustomMessage = function(msg) {
	this.clientSocket.send(msg);
}
*/
HandlerBridgeClientSide.prototype.sendUpdate = function(msg) {
	this["clientSocket"].send(msg);
}
HandlerBridgeClientSide.prototype.sendUpdateToServer = function() {
	var difObj = this.gameHandler.sendstate;
	var msg = JSON.stringify(difObj);
	this.sendUpdate(msg);
	difObj.clear();
}
HandlerBridgeClientSide.prototype.onCustomMsg = function(msg) {
	throw new Error("HandlerBridgeClientSide::onCustomMsg should be overriden by child");
}

if (!this.___alexnorequire) {
	exports.HandlerBridgeServerSide = HandlerBridgeServerSide;
	exports.HandlerBridge = HandlerBridge;
}

