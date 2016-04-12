SailboatRunClient = function() {
	this.gameStructure = new InitializeClientStructure(Sailboat.getInitObj());
	//this.client = new Sailboat.Client(this.gameStructure);
	
	//Sailboat.ClientGameStateCallbacks.call(this.gameStructure, this.graphics);
}
/*
SailboatRunClient.onInput = function(obj) {
	if (obj.x) {
		if (this["gameHandler"].myPlayer) {
		var shipArray = this["gameHandler"].myPlayer.children[0];
		for (var o of shipArray.children) {
			if (o) {
			var ship = o;
			var scale = 0.2;
			var shipPos = ship.children[0];
			shipPos.wrappedObj.velX = obj.x*scale;
			shipPos.wrappedObj.velY = obj.y*scale;
			}
			}
		}
		//console.log(JSON.stringify(shipPos.wrappedObj));
	//console.log(obj);
	//debugger;
	}
}
*/
/*
SailboatRunClient.onBulletShoot = function(gameStateEntity) {
	//var bulletArray = this["gameHandler"].gs.entity.getChildByIdentifier("bulletArray");
	//var nb = bulletArray.addObjToArrayNextAvailable();
	var mult = 1500;
	var offset = 500;
	var pos = gameStateEntity.getChildByIdentifier("position").wrappedObj;
	var vx = -1*pos.velX;
	var vy = -1*pos.velY;
	var x = pos.x + vx*mult;
	var y = pos.y + vy*mult;
	var ut = this["gameHandler"].getGameTime();
	var sd = {x:x, y:y, velX:vx, velY:vy, updateTime:ut};
	//debugger;
	var nb = this["gameHandler"].officialNewObj("bulletArray", sd, this["gameHandler"].myPlayer);
}
*/
/*
SailboatRunClient.onDeadShip = function(gameStateObj) {
	var shipNum = gameStateObj.getIndex();
	var playerNum = gameStateObj.getPlayerIndex();
	var removeFrag = gameStateObj.getRemovalFrag();
	this["gameHandler"].officialChange(removeFrag);
	//debugger;
}
*/
/*
SailboatRunClient.onFrame = function(eventData) {
	//console.log("onFrame");
	//deprecated
	debugger;

}
*/
Sailboat.Client = function() {
}
Sailboat.Client.prototype.onFrame = function(eventData) {
	this.controlsManager.inputUpdates(eventData.dt, this["gameHandler"].getGameTime())
	this["gameHandler"].update();
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
			
			this["client"].controlsManager.addControl( 
				new CraftyControlsCircleMover(this["gameHandler"].myPlayer, "w", "s", "d", "a")
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

	this.updateLoopId = setInterval(updateLoop.bind(this.gameStructure), 80);
	this.graphics = new SailboatGraphics(this.gameStructure);
	this.controlsManager = new CraftyControlsManager();
	
	this.graphics.callbacks.register(this.onFrame.bind(this), "OnFrame");
	this.graphics.callbacks.register(this.onDeadShip.bind(this), "OnDeadShip");
	this.registerGameStateCallbacks();
}
Sailboat.Client.prototype.registerGameStateCallbacks = function() {
	var gs = this["gameHandler"].gs;
	var callbacks = gs.callbacks;
	var graphicsObject = this.graphics
	var onFrame = function() {
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
