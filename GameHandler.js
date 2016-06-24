//var THREE = require("three");
if (!this.___alexnorequire) {
var util = require("util");
var DifferenceObj = require("./DiffObj").DifferenceObj;
var GameStateEntity = require("./GameStateEntity").GameStateEntity;
}



function GameHandler(GameStateType) {

	this.gs = new GameStateType();
	this.playerList = [];
	this.st = undefined;
	this.sendstate = new DifferenceObj();
	this.init();


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
	return new Date().getTime()/1000 - this.st;
}
GameHandler.prototype.init = function() {
	//throw new Error("test");
	this.st = new Date().getTime()/1000;
}
GameHandler.prototype.setStartTime = function(t) {
	throw new Error("deprecated");
	this.st = t;
}
GameHandler.prototype.setCurrentGameTime = function(t) {
	var ct = new Date().getTime()/1000;
	this.st = ct - t;
}
GameHandler.prototype.resetGame = function() {
	this.gs.clear();
	this.sendstate.clear();
	//this.st = new Date().getTime();
	this.init();
}
GameHandler.prototype.update = function() {
	this.gs.update(this.getGameTime());
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
GameHandler.prototype.receiveUpdate = function(obj) {
	/*
	if (console)
		console.log("receiveUpdate: "+JSON.stringify(obj));
	else
		util.log("receiveUpdate: "+JSON.stringify(obj));
*/
	var difo = DifferenceObj.makeFromObj(obj);
	this.gs.applyDifObj(difo);

	return difo;
	
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

if (!this.___alexnorequire) 
exports.GameHandler = GameHandler;
