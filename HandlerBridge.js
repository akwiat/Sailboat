if (!this.___alexnorequire) {
	var GameStructureCodes = require("./GameStructureCodes").GameStructureCodes;
	var TreeNode = require("./Tree").TreeNode;
	var util = require("util");
//var AlexInheritConstructor = require("./AlexInherit").AlexInheritConstructor;
//var AlexInheritDetails = require("./AlexInherit").AlexInheritDetails;
}


function HandlerBridge() {
	//msg codes here

}


HandlerBridge.prototype.receiveMsg = function(msg) {

}

function HandlerBridgeServerSide() {
	/*
   this.serverSocketLayer = serverSocketLayer;
   this.serverHandler = serverHandler;
   */
}
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
HandlerBridgeServerSide.prototype.sendUpdateToAllClients = function(difObj) {
	var difObj = this["gameHandler"].pullSendstate();
	var gameHandler = this["gameHandler"];
	//util.log("\n\n\nsendUpdateToAllClients: "+JSON.stringify(difObj));
	var sendFunction = function(sendable, clientLocationStr) {
		//util.log("sendFunction: "+id);
		var theReplacer = function(key, value) {
			var obj = this[key];

			var shortLoc;
			if (obj && obj.destination) {
				var selfLoc = JSON.stringify(obj.treeLocation);
				var recipLoc = clientLocationStr;
				util.log("selfLoc: "+selfLoc);
				util.log("recipLoc: "+recipLoc);
				//util.log(selfLoc == recipLoc);
				var selfTeam = undefined;
				var recipTeam = undefined;
				//var selfTeam = gameHandler.getTeamNameFromLocation(JSON.parse(selfLoc));
				//var recipTeam = gameHandler.getTeamNameFromLocation(JSON.parse(reciploc));
				var shouldSend = obj.destination.checkIfSend(selfLoc, recipLoc, selfTeam, recipTeam);
				if (!shouldSend)
					return undefined;
				//util.log(shouldSend);
			}
			/*
			if(obj && obj.clientProperty) {
			//console.log(JSON.stringify(obj.clientProperty));
			var clientLoc = JSON.parse(clientLocationStr);
			shortLoc = TreeNode.trimToLength(obj.clientProperty, clientLoc);
			console.log(JSON.stringify(shortLoc));
			console.log(JSON.stringify(clientLoc));
			console.log("cp: "+JSON.stringify(obj.clientProperty))
			}
			*/
			/*
			if (obj && obj.clientProperty !== undefined && TreeNode.compareLocations(clientLoc, shortLoc))
				{util.log("----clientProperty"); return undefined; }
			else */if (obj && obj.shouldRemove)
				{util.log("----shouldRemove"); return value}
			// && parseInt(obj.getIndex()) == parseInt(id))
				//{util.log("----shouldRemove"); util.log(JSON.stringify(obj.clientProperty)); util.log(JSON.stringify(clientLoc)); return undefined;}
			//else
				return value;
		}
		var msg = JSON.stringify(difObj, theReplacer);
		util.log("msg: "+msg);
		sendable.send(msg);
	}
	this["serverHandlerLink"].sendToAllClientsCallback(sendFunction);
	difObj.clear();
}
/*
HandlerBridgeServerSide.prototype.sendUpdateToAllClients = function(difObj) {
	var difObj = this["gameHandler"].pullSendstate();
	//util.log("\n\n\nsendUpdateToAllClients: "+JSON.stringify(difObj));
	var sendFunction = function(sendable, clientLocationStr) {
		//util.log("sendFunction: "+id);
		var theReplacer = function(key, value) {
			var obj = this[key];

			var shortLoc;
			if(obj && obj.clientProperty) {
			//console.log(JSON.stringify(obj.clientProperty));
			var clientLoc = JSON.parse(clientLocationStr);
			shortLoc = TreeNode.trimToLength(obj.clientProperty, clientLoc);
			console.log(JSON.stringify(shortLoc));
			console.log(JSON.stringify(clientLoc));
			console.log("cp: "+JSON.stringify(obj.clientProperty))
			}

			//if (obj && obj.clientProperty !== undefined && parseInt(obj.clientProperty) === parseInt(obj.getIndex() ))
			if (obj && obj.clientProperty !== undefined && TreeNode.compareLocations(clientLoc, shortLoc))
				{util.log("----clientProperty"); return undefined; }
			else if (obj && obj.shouldRemove)
				{util.log("----shouldRemove"); return value}
			// && parseInt(obj.getIndex()) == parseInt(id))
				//{util.log("----shouldRemove"); util.log(JSON.stringify(obj.clientProperty)); util.log(JSON.stringify(clientLoc)); return undefined;}
			else
				return value;
		}
		var msg = JSON.stringify(difObj, theReplacer);
		//util.log(msg);
		sendable.send(msg);
	}
	this["serverHandlerLink"].sendToAllClientsCallback(sendFunction);
	difObj.clear();
}
*/
HandlerBridgeServerSide.prototype.sendCustomMessage = function(sendable, msg) {
	sendable.send(msg);
}

//AlexInheritDetails(HandlerBridgeServerSide,HandlerBridge);

/*
function HandlerBridgeClientSide(clientSocketLayer, clientHandler) {
   this.clientSocketLayer = clientSocketLayer;
   this.clientHandler = clientHandler;
}
HandlerBridgeClientSide.prototype.register = function(csl, clientH) {
	this.clientSocketLayer = csl;
	this.clientHandler = clientH;
}
*/
function HandlerBridgeClientSide() {
	//this.clientSocket
	//this.clientHandler
	//are implicit from the structure
}
HandlerBridgeClientSide.prototype.receiveMsg = function(msg) {
	// console.log("client got msg: "+msg);
	var c = msg.charAt(0);
	if (c == "{") { //is JSON
		var o = JSON.parse(msg);
		this.gameHandler.receiveUpdate(o);
	} else {
		this.gameStructure.trigger(msg, GameStructureCodes.CLIENTGOTCUSTOMMSG, undefined, this.gameStructure);
		//this.clientHandler.onCustomMsg(msg);
	}
}
HandlerBridgeClientSide.prototype.sendCustomMessage = function(msg) {
	this.clientSocket.send(msg);
}
HandlerBridgeClientSide.prototype.sendUpdate = function(msg) {
	//throw new Error("should inspect")
	//console.log("client sending: "+msg);
	this.clientSocket.send(msg);
}
HandlerBridgeClientSide.prototype.sendUpdateToServer = function() {
	var difObj = this.gameHandler.sendstate;
	var msg = JSON.stringify(difObj);
	// console.log(msg);
	this.sendUpdate(msg);
	difObj.clear();
}
HandlerBridgeClientSide.prototype.onCustomMsg = function(msg) {
	throw new Error("HandlerBridgeClientSide::onCustomMsg should be overriden by child");
}
//AlexInheritDetails(HandlerBridgeClientSide,HandlerBridge);


if (!this.___alexnorequire) {
	exports.HandlerBridgeServerSide = HandlerBridgeServerSide;
	exports.HandlerBridge = HandlerBridge;
}
