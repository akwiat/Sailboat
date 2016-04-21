Sailboat.Client.prototype.gameStructureHasInitialized = function() {
	
	
	var gameStructureCallbacks = this.gameStructure.callbacks;
	var updateLoop = function() {
		if (this["gameHandler"].myPlayer) {
		var frag = this["gameHandler"].myPlayer.getSpecificFrag();
		this["gameHandler"].sendstate.add(frag);
		this["handlerBridge"].sendUpdateToServer();
		}
	}
	var clientCustomMsg = function(msg) {
		//console.log("client custom msg: "+msg);
		var c = msg.charAt(0);
		var str = msg.slice(1);
		if (c == "p") {

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

			this.shipControl = new ThreexControlsCircleMover(myShipPos, "w", "s", "d", "a");

			this["gameStructure"]["client"].controlsManager.addControl(this.shipControl);

			this["gameStructure"]["client"].controlsManager.addControl(
				new ThreexControlsAction(this.onShoot.bind(this), "f")
				);


			//debugger;

		} else {
			throw new Error("custom msg bad id");
		}
	}
	gameStructureCallbacks.register(clientCustomMsg.bind(this), GameStructureCodes.CLIENTGOTCUSTOMMSG);

	this.updateLoopId = setInterval(updateLoop.bind(this.gameStructure), 10000);
	this.graphics = new SailboatGraphics(this.graphicsSettings);
	this.controlsManager = new ThreexControlsManager(Crafty);
	
	this.hudManager = new HudManager();
	this.cooldownManager = new CooldownManager();


	//this.respawnCooldown = new 
	this.graphics.callbacks.register(this.onFrame.bind(this), "OnFrame");
	this.graphics.callbacks.register(this.onDeadShip.bind(this), "OnDeadShip");
	this.registerGameStateCallbacks();
}

//Sailboat.Client.prototype.set
