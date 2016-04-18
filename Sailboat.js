if (!this.___alexnorequire) {
	var GameStructureCodes = require("./GameStructureCodes").GameStructureCodes;
	var GameState = require("./GameState").GameState;
	var GameStateEntity = require("./GameStateEntity").GameStateEntity;
	var GameHandler = require("./GameHandler").GameHandler;
	var Prop = require("./Prop").Prop
	var util = require("util");
}
function Shield() {
	this.shieldUp = false;
	this.updateTime = undefined;
}
Shield.prototype.getSpecificData = function() {
	var s;
	if (this.shieldUp)
		s = 1;
	else 
		s = 0;

	var d = 1000;
	var ut = Math.round(this.updateTime*d)/d;
	return {s:s, ut:ut};
}
Shield.prototype.applySpecificData = function(obj) {
	if (obj.s != undefined) {
		if (obj.s == 1)
			this.shieldUp = true
		else
			this.shieldUp = false;
	}

	if (obj.ut != undefined) {
		this.updateTime = obj.ut;
	}

}
Shield.prototype.propagate = function(t) {

}
function Sailboat() {}
Sailboat.settings = {
	InternalGameSize:1000
	,ShipRadius:25
	,BulletRadius:20
}
Sailboat.getInitObj = function() {
	var getShipCircle = function() {
		var cm = this.findChildWithIdentifier("position").getWrappedObj();
		var p = cm.position;
		var x = p.x;
		var y = p.y;
		var r = Sailboat.settings.ShipRadius;
		//var a = cm.angle.scalarValue;
		
		var ret = new SAT.Circle(new SAT.Vector(x,y), r);
		return ret;
	}
	var SAShip = function() {
		var boostManager = function(propPos, propAngle) {
			var maxV = 200.0;
			var maxA = 5.0;
			if (propPos.velX > maxV) propPos.velX = maxV;
			if (propPos.velX < -1.0*maxV) propPos.velX = -1.0*maxV;
			if (propPos.velY > maxV) propPos.velY = maxV;
			if (propPos.velY < -1.0*maxV) propPos.velY = -1.0*maxV;

			if (propAngle.velocity > maxA) propAngle.velocity = maxA;
			if (propAngle.velocity < -1.0*maxA) propAngle.velocity = -1.0*maxA;
		}
		var ret = new GameStateEntity("ship");
		ret.addComponent( new GameStateEntity("position",
		new Prop.PropCircleMover().setBoostManager(boostManager) ).setClientProperty());

		ret.addComponent( new GameStateEntity("shield",
			new Shield() ).setClientProperty()
			);
			
		//ret.shipRadius = 25;
		ret.constructor.prototype.getShipCircle = getShipCircle; 
		return ret;
	}

	
	var SABullet = function(sd) {
		var ret = new GameStateEntity("bullet");
		ret.addComponent( new GameStateEntity("position",
			new Prop.PropVector2d(sd) ).setClientProperty() );
		return ret;
	}
	
	/*
	var HAPlayer = function() {
		var ret = new GameStateEntity("player");
		var ships = new GameStateEntity("shipArray");
		ships.addComponentArray(HAShip, 3);
		ret.addComponent(ships);

		var bullets = new GameStateEntity("bulletArray");
		bullets.addComponentArray(HABullet, 0);
		ret.addComponent(bullets);
		return ret;
	}
	*/
	var SAPlayer = function() {
		var ret = new GameStateEntity("player");
		ret.addComponent( new SAShip() );
		return ret;
	}
	var gameStateType = function() {
		var ret = new GameState();
		var playerArray = new GameStateEntity("playerArray");
		playerArray.addComponentArray(SAPlayer, 0);
		ret.entity.addComponent(playerArray);

		var bulletArray = new GameStateEntity("bulletArray");
		bulletArray.addComponentArray(SABullet, 0);
		ret.entity.addComponent(bulletArray);

		return ret;
	}

	var ret = {gameHandler: new GameHandler(gameStateType)};
	if (Sailboat.Client)
		ret.client = new Sailboat.Client();
	return ret;
	//return {gameHandler: new GameHandler(gameStateType), client: new Sailboat.Client()};
}
Sailboat.Server = function(gameStructure) {
	var callbacks = gameStructure.callbacks;
	var serverNewConn = function() {

		//var nEnt = this["gameHandler"].gs.entity.children[0].addObjToArrayNextAvailable();
		var nEnt = this["gameHandler"].getObjByName("playerArray").addObjToArrayNextAvailable();
		//util.log(JSON.stringify(nEnt));
		var id = nEnt.getIndex();
		util.log("onNewConnection: "+id);

		return id;
	}
	callbacks.register(serverNewConn, GameStructureCodes.SERVERNEWCONN);
	var serverInitPlayer = function(gsid) {
		//init conditions, send everything
		util.log("serverInitPlayer, gsid: "+gsid);
		var state = this["gameHandler"].gs;
		//var pEnt = state.entity.children[0].children[gsid];
		var pEnt = this["gameHandler"].getObjByName("playerArray").children[gsid];
		var gt = this["gameHandler"].getGameTime();
		for (var i=0; i < 1; i++) {

		var iVals = getInitValues(gsid, gt);
		//iVals.ut = gt;
		

		//var ship = pEnt.getChildByIdentifier("shipArray").children[i];
		var ship = pEnt.getChildByIdentifier("ship");
		ship.getChildByIdentifier("position").applySpecificData(iVals);
		ship.getChildByIdentifier("shield").applySpecificData({ut:gt});

		}
		var others = pEnt.getSpecificFrag();
		util.log("other: "+JSON.stringify(others));
		this["gameHandler"].sendstate.add(others);
		
		var f = state.entity.getFrag();
		f.updateTime = gt;
		f.specificData = gsid;

	
		var msg = "p" + JSON.stringify(f);
		this["serverHandlerLink"].sendToClient(gsid, msg);
	}
	callbacks.register(serverInitPlayer, GameStructureCodes.SERVERINITPLAYER);
	var getInitValues = function(gsid, ut) {
		var x,y;
		var angle = Math.PI/2;
		if (gsid == 0) {
			x = 100; y = 100;
		} else if (gsid == 1) {
			x = 900; y = 100;
		} else if (gsid == 2) {
			x = 100; y = 900;
		} else if (gsid == 3) {
			x = 900; y = 900;
		} else throw new Error("bad initValues");

		return { p:{x:x,y:y,vx:40, ut:ut}, a:{s:angle, ut:ut}, ut:ut };
	}
	/*
	var getInitValues = function(gsid, shipnum) {
		var x,y;
		var vx, vy;
		if (gsid == 0) {
			x = 500;
			y = 150;
			vx = 0;
			vy = 0.01;
		} else if (gsid == 1) {
			x = 500;
			y = 850;
			vx = 0;
			vy = -0.01;
		}
		else {
			throw new Error("bad gsid");
		}

		if (shipnum == 0) {

		} else if (shipnum == 1) {
			x += 300;
			y -= 80;
		} else if (shipnum == 2) {
			x -= 300;
			y -= 80;
		} else {
			throw new Error("bad shipnum: "+shipnum);
		}
		return {x:x, y:y, vx:vx, vy:vy};
	}
	*/
	var serverPlayerDisconnected = function(clientId) {
		util.log("child::clientDisconnected: "+clientId);
		//var p = this["gameHandler"].gs.getObject(Player.gameStateCode, clientId);
		//var p = this["gameHandler"].gs.entity.children[0].children[clientId];
		var p = this["gameHandler"].getObjByName("playerArray").children[clientId];
		var f = p.getRemovalFrag();
		//var f2 = p.getFrag();
		//util.log(JSON.stringify(f2));
		util.log(JSON.stringify(f));
		//console.log(JSON.stringify(f));
		this["gameHandler"].officialChange(f);
		//util.log(JSON.stringify(this["gameHandler"].gs));
	}
	callbacks.register(serverPlayerDisconnected, GameStructureCodes.SERVERCLIENTDISC);
	var updateLoop = function() {
		var difObj = this["gameHandler"].sendstate;
		this["handlerBridge"].sendUpdateToAllClients(difObj);
	}
	gameStructure.updateLoopId = setInterval(updateLoop.bind(gameStructure), 80);
}



if (!this.___alexnorequire) {
	exports.Sailboat = Sailboat;
}
