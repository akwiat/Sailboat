//var THREE = require("three");
if (!this.___alexnorequire) {
var util = require("util");
var DifferenceObj = require("./DiffObj").DifferenceObj;
var GameStateEntity = require("./GameStateEntity").GameStateEntity;
}



//function GameHandler(link, gs) {
function GameHandler(GameStateType) {
	//this.gs = gs;
	//this.serverLink = link;

	/*
	this.handlerBridge
	implicit from structure
	*/

	this.gs = new GameStateType();
	this.playerList = [];
	this.st = undefined;
	/*
	this.physicsLoopInterval = 2000;
	this.updateLoopInterval = 2000;

	this.st = new Date().getTime();//autostart

	this.physicsLoopId = setInterval(this.physicsLoop.bind(this,this.st), this.physicsLoopInterval);
	this.updateLoopId = setInterval(this.updateLoop.bind(this,this.st),this.updateLoopInterval);

	*/
	//--this.sendstate = new DifferenceObj(this.gs.fragMaker.bind(this.gs))
	this.sendstate = new DifferenceObj();
	this.init();
	//this.loopnum

}
GameHandler.prototype.getObjByName = function(name){
	return this.gs.entity.getChildByIdentifier(name);
}
GameHandler.prototype.getFullStateDifObj = function() {
	var difObj = new DifferenceObj();
	difObj.timestamp = this.getGameTime();
	this.gs.addEverything(difObj);
	return difObj;
}
GameHandler.prototype.getGameTime = function() {
	return new Date().getTime() - this.st;
}
/*
GameHandler.prototype.physicsLoop = function(st) {
	var ct = new Date().getTime() - st;
}
GameHandler.prototype.updateLoop = function(st) {
  	var ct = new Date().getTime() - st;
  	util.log("parent updateLoop");
}
*/
GameHandler.prototype.init = function() {
	this.st = new Date().getTime();
}
GameHandler.prototype.setStartTime = function(t) {
	this.st = t;
}
GameHandler.prototype.setCurrentGameTime = function(t) {
	var ct = new Date().getTime();
	this.st = ct - t;
}
GameHandler.prototype.resetGame = function() {
	this.gs.clear();
	this.sendstate.clear();
	//this.st = new Date().getTime();
	this.init();
}
GameHandler.prototype.update = function(shouldUpdateGraphics) {
	this.gs.update(this.getGameTime(), shouldUpdateGraphics);
}
GameHandler.prototype.applyFrag = function(frag) {
	this.gs.applyFrag(frag);
}
GameHandler.prototype.officialChange = function(frag) {
	this.sendstate.add(frag);
	this.gs.applyFrag(frag);
}

GameHandler.prototype.officialNewObj = function(identifier, initData, startObj) {
	var startObj = startObj || this.gs.entity;
	var array = startObj.getChildByIdentifier(identifier);
	var nObj = array.addObjToArrayNextAvailable(undefined, initData);
	this.gs.callbacks.trigger(nObj, "new", nObj.identifier);
	//var index = this.gs.addNew(obj);
	this.sendstate.add(nObj.getSpecificFrag());
	return nObj;
}
GameHandler.prototype.unOfficialNewObj = function(obj) {
	throw new Error("deprecated");
	var index = this.gs.addNew(obj);
	return obj;
}

/*
GameHandler.prototype.officialRemove = function(gc, oi) {
	var f = Frag.removalFrag(gc, oi);
	this.officialChange(f);
}
*/
/*
GameHandler.prototype.connectionReady = function(id) {
	//can initialize the new player
}
*/
GameHandler.prototype.receiveUpdate = function(obj) {
	/*
	if (console)
		console.log("receiveUpdate: "+JSON.stringify(obj));
	else
		util.log("receiveUpdate: "+JSON.stringify(obj));
*/
	var difo = DifferenceObj.makeFromObj(obj);
	this.gs.applyDifObj(difo);
	//this.sendstate.appendDifObj(difo);
	return difo;
	//this.sendstate.appendDifObj(difo);
}
GameHandler.prototype.receiveAndPassUpdate = function(obj) {
	var difo = this.receiveUpdate(obj);
	this.sendstate.appendDifObj(difo);
}
GameHandler.prototype.pullSendstate = function() {
	var ret = this.sendstate;
	return ret;
	//this.send
}
/*
GameHandler.prototype.sendState = function(sendable) {

}
*/
/*
GameHandler.prototype.update = function(obj) {
	throw new Error("deprecated")
	var difo = DifferenceObj.makeFromObj(obj);
	this.gs.apply(difo,this.sendstate);
}*/
/*
GameHandler.prototype.newPlayer = function() {
	return this.gs.addNewPlayer();
}
GameHandler.prototype.onNewConnection = function() {
	util.log("subclass should override onNewConnection");
	return 12;
}
GameHandler.prototype.clientDisconnected = function(clientId) {
  util.log("clientDisconnected: "+clientId);
}
*/
/*
GameHandler.replacer = function(k,v) {
	if (v===undefined) return undefined;
	//if (k=="updatetime") return undefined;
	//GameHandler.replacer.pgsid = undefined;
	if (v.t === Player.TID
		&&v.i === GameHandler.replacer.pgsid)
	{
		var ret = {};
		for (var i in v) {
			if (v.hasOwnProperty(i)) {
				ret[i] = v[i];
			}
		}
		ret.p = undefined;
		ret.q = undefined;
		ret.v = undefined;
		//ret.l = undefined;
		return ret;
	}

	return v;
}
*/
/*
GameHandler.prototype.message = function(str) {
}
*/

if (!this.___alexnorequire) 
exports.GameHandler = GameHandler;