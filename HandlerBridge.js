if (!this.___alexnorequire) {
	var GameStructureCodes = require("./GameStructureCodes").GameStructureCodes;
	var TreeNode = require("./Tree").TreeNode;
	var util = require("util");
}
function HandlerBridge() {//msg codes here}
HandlerBridge.prototype.receiveMsg = function(msg) {}
function HandlerBridgeServerSide() {}
HandlerBridgeServerSide.prototype.receiveMsg = function(msg) {
   var c = msg.charAt(0);
   if (c == "{") {//is JSON
   		//util.log("receiveMsg: "+msg);
     var o = JSON.parse(msg);
     this["gameHandler"].receiveAndPassUpdate(o);
   } else {
   	 this.gameStructure.trigger(msg, GameStructureCodes.SERVERGOTCUSTOMMSG, undefined, this.gameStructure);
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
	var gameHandler = this["gameHandler"];

	var sendFunction = function(sendable, clientLocationStr) {
	
		var theReplacer = function(key, value) {
			
		}
		var msg = JSON.stringify(difObj, theReplacer);
		util.log("msg: "+msg);
		sendable.send(msg);
	}
	this["serverHandlerLink"].sendToAllClientsCallback(sendFunction);
	difObj.clear();
}
HandlerBridgeServerSide.prototype.sendCustomMessage = function(sendable, msg) {
	sendable.send(msg);
}


//------HandlerBridgeClientSide
function HandlerBridgeClientSide() {
	//this.clientSocket
	//this.clientHandler
	//are implicit from the structure
}
HandlerBridgeClientSide.prototype.receiveMsg = function(msg) {
	var c = msg.charAt(0);
	if (c == "{") { //is JSON
		var o = JSON.parse(msg);
		this.gameHandler.receiveUpdate(o);
	} else {
		this.gameStructure.trigger(msg, GameStructureCodes.CLIENTGOTCUSTOMMSG, undefined, this.gameStructure);
	}
}
HandlerBridgeClientSide.prototype.sendCustomMessage = function(msg) {
	this.clientSocket.send(msg);
}
HandlerBridgeClientSide.prototype.sendUpdate = function(msg) {
	this.clientSocket.send(msg);
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
