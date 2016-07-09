function SailboatClientBehavior(clientBehavior) {
	var settings = SailboatSettings;
  //var clientBehavior = new ClientBehavior(settings);
  clientBehavior.graphics = new SailboatGraphics(settings);
  clientBehavior.controlsManager = new ThreexControlsManager(Crafty);
  clientBehavior.hudManager = new HudManager();
  clientBehavior.cooldownManager = new CooldownManager();

  clientBehavior.goAlienTeam = function() {
	var code = this.gameSettings.AlienTeamCode;
	var msg = code + this.myId;
	console.log("msg: "+msg);

	this["gameStructure"].handlerBridge.sendCustomMessage(msg);

	this.uiManager.hideTeamSelect();


}
clientBehavior.goHumanTeam = function() {
	var code = this.gameSettings.HumanTeamCode;
	var msg = code + this.myId;

	this["gameStructure"].handlerBridge.sendCustomMessage(msg);
	this.uiManager.hideTeamSelect();

}
clientBehavior.onFrame = function(eventData) {

	var gt = this["gameHandler"].getGameTime();
	this.cooldownManager.onUpdate(gt);
	this.controlsManager.inputUpdates(eventData.dt/1000, gt);
	this["gameHandler"].update();
	this.checkCollisions();

}
clientBehavior.onDeadShip = function(gameStateObj) {

	var gt = this["gameHandler"].getGameTime();
	this.shotCooldown.resetCooldown();
	var ret = this.respawnCooldown.attempt(gt);
	if (ret) {
	var removeFrag = gameStateObj.getRemovalFrag();
	this["gameHandler"].officialChange(removeFrag);

	} else debugger;

  }

	var customMessageInitP = function(str) {
		var state = this["gameStructure"]["gameHandler"].gs;
			var frag = Frag.makeFromStr(str);
			console.log(frag);
			this["gameStructure"]["gameHandler"].setCurrentGameTime(frag.updateTime);
			state.applyFrag(frag);
			//this["gameStructure"]["gameHandler"].myPlayer = state.entity.children[0].children[frag.specificData];
			this["gameStructure"]["gameHandler"].myPlayer = state.entity.getObjFromPath(frag.specificData);
			var myPlayer = this["gameStructure"]["gameHandler"].myPlayer;
			var arrayName = myPlayer.parent.getIdentifier();
			//debugger;
			this["gameStructure"]["client"].setupTeamFunctions(arrayName);

			//var myShip = myPlayer.findChildWithIdentifier("ship")
			var myShip = myPlayer.getChildByIdentifier("shipArray").children[0];
			var myShipPos = myShip.findChildWithIdentifier("position").getWrappedObj();

			//this.shipControl = new ThreexControlsCircleMover(myShipPos, "w", "s", "d", "a");
			this.shipControl = new ThreexControlsCircleMover(myShipPos, "w", "s", "d", "a");
			this.teamSpecificControls(this.shipControl);
			
			this["gameStructure"]["client"].controlsManager.addControl(this.shipControl);

			this["gameStructure"]["client"].controlsManager.addControl(
				new ThreexControlsAction(this.onShoot.bind(this), " ")
				);


			//debugger;
	}
	this["handlerBridge"].subscribeToInitPackage(customMessageInitP);

  
	Sailboat.Client.registerGameStateCallbacks(clientBehavior);
	Sailboat.Client.initializeTeamBehavior(clientBehavior);
	Sailboat.Client.initializeCollisions(clientBehavior);
  return clientBehavior;
}
