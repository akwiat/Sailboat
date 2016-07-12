define(["./Sailboat", "./SailboatGraphics", "reuseable/LoadingManager"], function (Sailboat, SailboatGraphics, LoadingManager) { 
   function SailboatClient() {
     this.gameStructure = new Sailboat.ClientStructure();
     var clientSocket = this.gameStructure.clientSocket;
     this.loadingManager = new LoadingManager(this.activate.bind(this));
     this.loadingManager.registerRequirement("loadGraphics", SailboatGraphics.loadEverything);
     this.serverConnectCallback = this.loadingManager.registerRequirement("connectServer", clientSocket.initializeConnection.bind(clientSocket), LoadingManager.RETURNCALLBACK);
     this.gameStructure.callbacks.registerSingle(this.serverConnectCallback, this.gameStructure.CONNECTEDTOSERVER);
     this.loadingManager.beginLoading();
     
     
   }
   SailboatClient.prototype.graphicsDidLoad = function() {
   	this.loadingManager.completeRequirement("loadGraphics");
   }
   SailboatClient.prototype.activate = function() {
   	deugger;
   	this.gameStructure["clientBehavior"].activate();
   }
});
/*
Sailboat.Client = function() {

	throw new Error("deprecated");
	this.graphicsSettings = Sailboat.settings;
	this.gameSettings = Sailboat.settings;
	this.worldBox = new SAT.Box(new SAT.Vector(0,0), this.graphicsSettings.InternalGameSize, this.graphicsSettings.InternalGameSize).toPolygon();
	

	this.uiManager = new UiManager();
	this.uiManager.callbacks.register(this.goAlienTeam.bind(this), UiManager.ALIENBUTTON);
	this.uiManager.callbacks.register(this.goHumanTeam.bind(this), UiManager.HUMANBUTTON);

	this.myId = undefined;
	
	
	this.keyboardState = new THREEx.KeyboardState();
	this.controlsLoopInterval = 30; //ms

	clearInterval(this.updateLoopId);
	clearInterval(this.physicsLoopId);
	this.updateLoopInterval = 2000;
	this.updateLoopId = undefined;
}
Sailboat.Client.prototype.setMyId = function(id) {
	this.myId = id;
}

Sailboat.Client.prototype.goAlienTeam = function() {
	var code = this.gameSettings.AlienTeamCode;
	var msg = code + this.myId;
	console.log("msg: "+msg);

	this["gameStructure"].handlerBridge.sendCustomMessage(msg);

	this.uiManager.hideTeamSelect();


}
Sailboat.Client.prototype.goHumanTeam = function() {
	var code = this.gameSettings.HumanTeamCode;
	var msg = code + this.myId;

	this["gameStructure"].handlerBridge.sendCustomMessage(msg);
	this.uiManager.hideTeamSelect();

}
Sailboat.Client.prototype.onFrame = function(eventData) {

	var gt = this["gameHandler"].getGameTime();
	this.cooldownManager.onUpdate(gt);
	this.controlsManager.inputUpdates(eventData.dt/1000, gt);
	this["gameHandler"].update();
	this.checkCollisions();

}
Sailboat.Client.prototype.onDeadShip = function(gameStateObj) {

	var gt = this["gameHandler"].getGameTime();
	this.shotCooldown.resetCooldown();
	var ret = this.respawnCooldown.attempt(gt);
	if (ret) {
	var removeFrag = gameStateObj.getRemovalFrag();
	this["gameHandler"].officialChange(removeFrag);

	} else debugger;

}
Sailboat.Client.prototype.activate = function() {
	
}
*/
