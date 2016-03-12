var util = require("util");
var GameStructureCodes = require("./GameStructureCodes").GameStructureCodes;

function ServerHandlerLink() {
	this.serverHandlerMap = {};
	this.handlerServerMap = {};

	/*this.gameServer 
	  this.handlerBridge
	implicit from structure
	*/

}
/*
ServerHandlerLink.prototype.register = function(serv, handler) {
	this.server = serv;
	this.handler = handler;
}
*/
ServerHandlerLink.prototype.getServerId = function(handlerId) {
	var servid = this.handlerServerMap[handlerId];
	if (servid == undefined) throw new Error("getServerId failed: "+JSON.stringify(this.handlerSeverMap));
	return servid;
}
ServerHandlerLink.prototype.getHandlerId = function(serverId) {
	return this.serverHandlerMap[serverId];
}
ServerHandlerLink.prototype.addConnection = function(serverId, handlerId) {
	this.serverHandlerMap[serverId] = handlerId;
	this.handlerServerMap[handlerId] = serverId;
}
ServerHandlerLink.prototype.removeConnection = function(serverId, handlerId) {
	this.serverHandlerMap[serverId] = undefined;
	this.handlerServerMap[handlerId] = undefined;
}
ServerHandlerLink.prototype.onMessage = function(msg) {
	//this.gameStructure.trigger(msg, GameStructure.SERVERGOTMSG);
	this.handlerBridge.receiveMsg(msg);
}
ServerHandlerLink.prototype.onNewConnection = function(serverId) {
	//var hid = this.handler.onNewConnection();
	var hid = this.gameStructure.trigger(undefined, GameStructureCodes.SERVERNEWCONN, undefined, this.gameStructure);
	this.addConnection(serverId, hid);
	this.gameStructure.trigger(hid, GameStructureCodes.SERVERINITPLAYER, undefined, this.gameStructure);
	//this.handler.connectionReady(hid);
}
ServerHandlerLink.prototype.clientDisconnected = function(serverId) {
	var hid = this.getHandlerId(serverId);
	//this.handler.clientDisconnected(hid);
	this.gameStructure.trigger(hid, GameStructureCodes.SERVERCLIENTDISC, undefined, this.gameStructure);
	this.removeConnection(serverId, hid);

}
ServerHandlerLink.prototype.sendToClient = function(handlerId, msg) {
 	var sid = this.getServerId(handlerId);
 	util.log("Link::sendToClient,serverId: "+sid);
 	this.gameServer.sendToClient(sid,msg);
}
ServerHandlerLink.prototype.sendToAllClientsCallback = function(callback) {
	var cb = function(sendable, serverId) {
		callback(sendable, this.getHandlerId(serverId));
	}.bind(this);
	this.gameServer.sendToAllClientsCallback(cb);
}

if (!this.___alexnorequire) {
	exports.ServerHandlerLink = ServerHandlerLink;
}
