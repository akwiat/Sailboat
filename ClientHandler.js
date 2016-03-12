//function ClientHandler(handlerBridge, gs) {
function ClientHandler(GameStateType) {
	//this.handlerBridge = handlerBridge;
	//this.gs = GameStateType();

	//this.gs is inherited
	//this.hbcs is implicit from the structure
	this.sendstate = new DifferenceObj();
	AlexInheritConstructor(this, GameHandler, GameStateType);

	this.keyboardState = new THREEx.KeyboardState();
	this.controlsLoopInterval = 30; //ms

	clearInterval(this.updateLoopId);
	clearInterval(this.physicsLoopId);
	this.updateLoopInterval = 2000;
	this.updateLoopId = undefined;
}
AlexInheritDetails(ClientHandler, GameHandler);
ClientHandler.prototype.sendUpdate = function(sendstate) {
	this.hbcs.sendUpdate(JSON.stringify(sendstate));
}
ClientHandler.prototype.onUpdate = function(obj) {
  	var difObj = DifferenceObj.makeFromObj(obj);
  	console.log(difObj);
  	this.gs.applyDifObj(difObj);
}
/*
ClientHandler.prototype.getGameTime = function(objectiveTime) {
	if (this.gameStartTime == undefined || objectiveTime == undefined)
		throw new Error("getGameTime: bad gameStartTime");

	return objectiveTime - this.gameStartTime;
	//return objectiveTime - this.objectiveTimeOfGameStart + this.gameStartTime;
	//will need to provide for the server sending the start time to the general client handler
}
ClientHandler.prototype.controlsLoop = function() {
	console.log("child should override controlsLoop");
	//var ct = this.getGameTime(new Date.getTime());

}
ClientHandler.prototype.updateLoop = function() {
	throw new Error("should override in child");
	//var gt = this.getGameTime(new Date().getTime());
}
*/
ClientHandler.prototype.startGame = function() {
	this.controlsLoopId = setInterval(this.controlsLoop.bind(this), this.controlsLoopInterval);
	this.controlsLoopTime = new Date().getTime();

	this.updateLoopId = setInterval(this.updateLoop.bind(this), this.updateLoopInterval);
}

