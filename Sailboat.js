if (!this.___alexnorequire) {
	var GameStructureCodes = require("./GameStructureCodes").GameStructureCodes;
	var GameState = require("./GameState").GameState;
	var GameStateEntity = require("./GameStateEntity").GameStateEntity;
	var GameHandler = require("./GameHandler").GameHandler;
	var Prop = require("./Prop").Prop
	var util = require("util");
}
function Sailboat() {}
Sailboat.getInitObj = function() {
	var HAShip = function() {
		var ret = new GameStateEntity("ship");
		ret.addComponent( new GameStateEntity("position",
		 new Prop.PropVector2d() ).setClientProperty());
		return ret;
	}
	var HABullet = function(sd) {
		var ret = new GameStateEntity("bullet");
		ret.addComponent( new GameStateEntity("position",
			new Prop.PropVector2d(sd) ).setClientProperty() );
		return ret;
	}

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

	var gameStateType = function() {
		var ret = new GameState();
		var playerArray = new GameStateEntity("playerArray");
		playerArray.addComponentArray(HAPlayer, 0);
		ret.entity.addComponent(playerArray);
/*
		var bulletArray = new GameStateEntity("bulletArray");
		bulletArray.addComponentArray(HABullet, 0);
		ret.entity.addComponent(bulletArray);
*/
		return ret;
	}
	return {gameHandler: new GameHandler(gameStateType)};
}
Sailboat.Server = function(gameStructure) {
	var callbacks = gameStructure.callbacks;
	var serverNewConn = function() {
		//var np = new HAPlayer();
		var nEnt = this["gameHandler"].gs.entity.children[0].addObjToArrayNextAvailable();
		var id = nEnt.getIndex();
		util.log("onNewConnection: "+id);
		//util.log(this["gameHandler"].gs.entity.children[0].children[0].getIndex());
		//util.log(JSON.stringify(this.gs));

		//this.initNewPlayer(np.gsid);
		return id;
	}
	callbacks.register(serverNewConn, GameStructureCodes.SERVERNEWCONN);
	var serverInitPlayer = function(gsid) {
		//init conditions, send everything
		util.log("serverInitPlayer, gsid: "+gsid);
		var state = this["gameHandler"].gs;
		var pEnt = state.entity.children[0].children[gsid];

		var gt = this["gameHandler"].getGameTime();
		for (var i=0; i < 3; i++) {

		var iVals = getInitValues(gsid, i);
		iVals.ut = gt;
		pEnt.children[0].children[i].children[0].applySpecificData(iVals);

		}
		var others = pEnt.getSpecificFrag();
		util.log("other: "+JSON.stringify(others));
		this["gameHandler"].sendstate.add(others);
		//var pFrag = pEnt.getFrag();
		var f = state.entity.getFrag();
		f.updateTime = gt;
		f.specificData = gsid;

		//this["gameHandler"].officialChange(pFrag);
		var msg = "p" + JSON.stringify(f);
		this["serverHandlerLink"].sendToClient(gsid, msg);
	}
	callbacks.register(serverInitPlayer, GameStructureCodes.SERVERINITPLAYER);
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

	var serverPlayerDisconnected = function(clientId) {
		util.log("child::clientDisconnected: "+clientId);
		//var p = this["gameHandler"].gs.getObject(Player.gameStateCode, clientId);
		var p = this["gameHandler"].gs.entity.children[0].children[clientId];
		
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
