var util = require("util");
var GameStructureCodes = require("./GameStructureCodes").GameStructureCodes;
var BasicIdManager = require("./AlexUtil").BasicIdManager;

function ServerHandlerLink() {
	this.serverHandlerMap = {};
	this.handlerServerMap = {};

	this.inactives = new BasicIdManager();
	this.inactivesIdentifier = "inactives";

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
ServerHandlerLink.prototype.defaultHandlerId = function() {
	var i = 0;
	while ( true ) {
		if (this.handlerServerMap[i] == undefined)
			return i;
		i++;
	}
}
ServerHandlerLink.prototype.addConnection = function(serverId, handlerId) {

	var hid;
	if (handlerId == undefined)
		hid = this.defaultHandlerId();
	else
		hid = handlerId;

	this.serverHandlerMap[serverId] = hid;
	this.handlerServerMap[hid] = serverId;

	return hid;
}
ServerHandlerLink.prototype.changeHandlerId = function(oldId, newId) {
    var len = this.inactivesIdentifier.length;
    if (oldId.slice(0, len) == this.inactivesIdentifier)
    	this.inactives.releaseId(oldId.slice(len));

    util.log("changeHandlerId: "+oldId.slice(0,len)+", "+oldId.slice(len));

	this.handlerServerMap[newId] = this.handlerServerMap[oldId];
	this.handlerServerMap[oldId] = undefined;

	var servId = this.handlerServerMap[newId];
	this.serverHandlerMap[servId] = newId;
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
	//var hid = this.gameStructure.trigger(undefined, GameStructureCodes.SERVERNEWCONN, undefined, this.gameStructure);
	//util.log("hid: "+hid);
	
	var hid = this.inactivesIdentifier + this.inactives.requestId();
	var realId = this.addConnection(serverId, hid);
	//this.gameStructure.trigger(realId, GameStructureCodes.INFORMCLIENTID);
	this["handlerBridge"].informClientId();
	//this.gameStructure.trigger(hid, GameStructureCodes.SERVERINITPLAYER, undefined, this.gameStructure);
	//this.handler.connectionReady(hid);
}
ServerHandlerLink.prototype.clientDisconnected = function(serverId) {
	var hid = this.getHandlerId(serverId);
	this["handlerBridge"].clientDisconnected();
	//this.gameStructure.trigger(hid, GameStructureCodes.SERVERCLIENTDISC, undefined, this.gameStructure);
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
