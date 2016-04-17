
/*
SailboatRunClient = function() {
	
	//this.client = new Sailboat.Client(this.gameStructure);
	
	//Sailboat.ClientGameStateCallbacks.call(this.gameStructure, this.graphics);
	SailboatGraphics.loadEverything(this.onLoad.bind(this));
}
SailboatRunClient.prototype.onLoad = function() {
	this.gameStructure = new InitializeClientStructure(Sailboat.getInitObj());
}
*/
Sailboat.Client = function() {
	
	GeneralClient.call(this, SailboatGraphics.loadEverything, Sailboat.getInitObj());
	this.graphicsSettings = Sailboat.settings;
	this.worldBox = new SAT.Box(new SAT.Vector(0,0), this.graphicsSettings.InternalGameSize, this.graphicsSettings.InternalGameSize).toPolygon();
	
}
Sailboat.Client.prototype = Object.create(GeneralClient.prototype);
Sailboat.Client.prototype.constructor = Sailboat.Client;

Sailboat.Client.prototype.onFrame = function(eventData) {
	//console.log(eventData.dt);
	this.controlsManager.inputUpdates(eventData.dt/1000, this["gameHandler"].getGameTime())
	this["gameHandler"].update();
	this.checkCollisions();
}
Sailboat.Client.prototype.onDeadShip = function(gameStateObj) {
	var shipNum = gameStateObj.getIndex();
	var playerNum = gameStateObj.getPlayerIndex();
	var removeFrag = gameStateObj.getRemovalFrag();
	this["gameHandler"].officialChange(removeFrag);
	//debugger;
}
Sailboat.Client.prototype.gameStructureHasInitialized = function() {
	
	
	var gameStructureCallbacks = this.gameStructure.callbacks;
	var updateLoop = function() {
		if (this["gameHandler"].myPlayer) {
		var frag = this["gameHandler"].myPlayer.getSpecificFrag();
		console.log(JSON.stringify(frag));
		this["gameHandler"].sendstate.add(frag);
		this["handlerBridge"].sendUpdateToServer();
		}
	}
	var clientCustomMsg = function(msg) {
		//console.log("client custom msg: "+msg);
		var c = msg.charAt(0);
		var str = msg.slice(1);
		if (c == "p") {

			var state = this["gameHandler"].gs;
			var frag = Frag.makeFromStr(str);
			console.log(frag);
			this["gameHandler"].setCurrentGameTime(frag.updateTime);
			state.applyFrag(frag);
			this["gameHandler"].myPlayer = state.entity.children[0].children[frag.specificData];
			
			
			var myShipPos = this["gameHandler"].myPlayer.findChildWithIdentifier("ship").findChildWithIdentifier("position").getWrappedObj();
			this["client"].controlsManager.addControl( 
				new ThreexControlsCircleMover(myShipPos, "w", "s", "d", "a")
				);
			//this["gameHandler"].updateLoop = setInterval
			//debugger;
			//var p = state.entity.children[0].children[0];
	
		//var f = p.getRemovalFrag();
		//console.log(f);
		//state.applyFrag(f);
		//debugger;
			//debugger;
		} else {
			throw new Error("custom msg bad id");
		}
	}
	gameStructureCallbacks.register(clientCustomMsg, GameStructureCodes.CLIENTGOTCUSTOMMSG);

	this.updateLoopId = setInterval(updateLoop.bind(this.gameStructure), 2000);
	this.graphics = new SailboatGraphics(this.graphicsSettings);
	this.controlsManager = new ThreexControlsManager(Crafty);
	
	this.graphics.callbacks.register(this.onFrame.bind(this), "OnFrame");
	this.graphics.callbacks.register(this.onDeadShip.bind(this), "OnDeadShip");
	this.registerGameStateCallbacks();
}
Sailboat.Client.prototype.registerGameStateCallbacks = function() {
	var gs = this["gameHandler"].gs;
	var callbacks = gs.callbacks;
	var graphicsObj = this.graphics;
	var onFrame = function() {
		debugger;
		this["gameHandler"].update();
		//graphicsObj.
	}
	
	var shipAdded = function(shipObj) {
		//console.log("shipAdded");
		//console.log(shipObj);
		//return undefined;
		var gObj = graphicsObj.getNewShipObj(shipObj);
		shipObj.setGraphicsObj(gObj);
		//gObj.alexGameStateObj = shipObj;
		//shipObj.setGraphicsObj(gObj);
	}
	/*
	var bulletAdded = function(bulletObj) {
		var gObj = graphicsObj.getNewBulletObj(bulletObj);
		bulletObj.setGraphicsObj(gObj);
	}
	var bulletRemoved = function(bulletObj) {
		graphicsObj.removeShipObj(bulletObj.graphicsObj);
	}
	*/
	var shipRemoved = function(shipObj) {
		//console.log("shipRemoved");
		graphicsObj.removeShipObj(shipObj.graphicsObj);

	}
	callbacks.register(shipAdded, "new", "ship");
	callbacks.register(shipRemoved, "removed", "ship");
	//callbacks.register(bulletAdded, "new", "bullet");
	//callbacks.register(bulletRemoved, "removed", "bullet");



}

Sailboat.Client.prototype.checkCollisions = function() {
	var myP = this["gameHandler"].myPlayer;
	if (myP) {
	var myShip = myP.findChildWithIdentifier("ship");
	var circle = myShip.getShipCircle();
	
	var resp = new SAT.Response();
	SAT.testPolygonCircle(this.worldBox, circle, resp)
	if (!resp.bInA) debugger; //collided with edge
	}
	
}
