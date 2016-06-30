
Sailboat.Client = function() {
	
	//GeneralClient.call(this, SailboatGraphics.loadEverything, Sailboat.getInitObj());
	this.graphicsSettings = Sailboat.settings;
	this.gameSettings = Sailboat.settings;
	this.worldBox = new SAT.Box(new SAT.Vector(0,0), this.graphicsSettings.InternalGameSize, this.graphicsSettings.InternalGameSize).toPolygon();
	

	this.uiManager = new UiManager();
	this.uiManager.callbacks.register(this.goAlienTeam.bind(this), UiManager.ALIENBUTTON);
	this.uiManager.callbacks.register(this.goHumanTeam.bind(this), UiManager.HUMANBUTTON);

	this.myId = undefined;
}
Sailboat.Client.prototype.setMyId = function(id) {
	this.myId = id;
}
//Sailboat.Client.prototype = Object.create(GeneralClient.prototype);
//Sailboat.Client.prototype.constructor = Sailboat.Client;
Sailboat.Client.prototype.goAlienTeam = function() {
	var code = this.gameSettings.AlienTeamCode;
	var msg = code + this.myId;
	console.log("msg: "+msg);

	this["gameStructure"].handlerBridge.sendCustomMessage(msg);

	this.uiManager.hideTeamSelect();
	//debugger;

}
Sailboat.Client.prototype.goHumanTeam = function() {
	var code = this.gameSettings.HumanTeamCode;
	var msg = code + this.myId;

	this["gameStructure"].handlerBridge.sendCustomMessage(msg);
	this.uiManager.hideTeamSelect();
	//debugger;
}
Sailboat.Client.prototype.onFrame = function(eventData) {
	//console.log(eventData.dt);
	var gt = this["gameHandler"].getGameTime();
	this.cooldownManager.onUpdate(gt);
	this.controlsManager.inputUpdates(eventData.dt/1000, gt);
	this["gameHandler"].update();
	this.checkCollisions();
	//console.log("finish onFrame");
}
Sailboat.Client.prototype.onDeadShip = function(gameStateObj) {
	// var shipNum = gameStateObj.getIndex();
	// var playerNum = gameStateObj.getPlayerIndex();
	var gt = this["gameHandler"].getGameTime();
	this.shotCooldown.resetCooldown();
	var ret = this.respawnCooldown.attempt(gt);
	if (ret) {
	var removeFrag = gameStateObj.getRemovalFrag();//removeFrag.setDestination(Destination.notMe());
	this["gameHandler"].officialChange(removeFrag);
	//debugger;
	} else debugger;

	//this.respawnShip(this["gameHandler"].getGameTime());
	//debugger;
}
