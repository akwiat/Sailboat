if (!this.___alexnorequire) {
	var GameStructureCodes = require("./GameStructureCodes").GameStructureCodes;
	var GameState = require("./GameState").GameState;
	var GameStateEntity = require("./GameStateEntity").GameStateEntity;
	var GameHandler = require("./GameHandler").GameHandler;
	var Prop = require("./Prop").Prop
	var util = require("util");
}
function ClientIdManager() {
	// this.maxId = Number.MAX_VALUE - 1;
	this.maxId = 10000;
	this.idMapping = {}
	this.lastId = -1;
}
ClientIdManager.prototype.getIndexFromId = function(id) {
	return this.idMapping[id].index;
}
ClientIdManager.prototype.getArrayNameFromId = function(id) {
	return this.idMapping[id].arrayName;
}
ClientIdManager.prototype.registerId = function(arrayName, index) {
	var id = null;
	while (id === null) {	
		if (this.lastId == this.maxId) {
			this.lastId = -1;
		}
		if (!(this.lastId + 1 in this.idMapping)) {
			id = this.lastId + 1;
			this.lastId = id;
		}
	}
	this.idMapping[id] = {arrayName: arrayName, index: index};
	return id;
}
ClientIdManager.prototype.unregisterId = function(id) {
	delete this.idMapping[id];
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
	,BulletCooldown:2
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
	var getBulletCircle = function() {
		var p = this.findChildWithIdentifier("position").getWrappedObj();
		var x = p.x;
		var y = p.y;
		var r = Sailboat.settings.BulletRadius;

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
			new Prop.PropVector2d(sd) ) );

		ret.constructor.prototype.getBulletCircle = getBulletCircle;
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
	/*
	var HumanTeam = function() {
		var ret = new GameStateEntity("humanTeam");
		ret.addComponentArray(SAPlayer, 0);
		return ret;
	}
	*/
	var gameStateType = function() {
		var ret = new GameState();
		var rootEntity = ret.entity;

		var hTeam = new GameStateEntity("humanTeam");
		hTeam.addComponentArray(SAPlayer, 0);
		rootEntity.addComponent(hTeam);

		var ateam = new GameStateEntity("alienTeam");
		ateam.addComponentArray(SAPlayer, 0);
		rootEntity.addComponent(ateam);
		/*
		var playerArray = new GameStateEntity("playerArray");
		playerArray.addComponentArray(SAPlayer, 0);
		ret.entity.addComponent(playerArray);
		*/
		var bulletArray = new GameStateEntity("bulletArray");
		bulletArray.addComponentArray(SABullet, 0);
		rootEntity.addComponent(bulletArray);

		return ret;
	}

	var ret = {gameHandler: new GameHandler(gameStateType)};
	if (Sailboat.Client)
		ret.client = new Sailboat.Client();
	return ret;
	//return {gameHandler: new GameHandler(gameStateType), client: new Sailboat.Client()};
}
Sailboat.Server = function(gameStructure) {
	gameStructure.clientIdManager = new ClientIdManager();
	var idManager = gameStructure.clientIdManager; //for closure

	var callbacks = gameStructure.callbacks;
	var serverNewConn = function() {

		
		//var nEnt = this["gameHandler"].getObjByName("humanTeam").addObjToArrayNextAvailable();
		//util.log(JSON.stringify(nEnt));
		//var id = nEnt.getIndex();
		var teamAllocator = function(gameHandler) {
			var hArray = gameHandler.getObjByName("humanTeam");
			var aArray = gameHandler.getObjByName("alienTeam");

			var hNum = hArray.countChildren();
			var aNum = aArray.countChildren();

			var ret;
			if (hNum == aNum)
				ret = hArray;
			else if (hNum > aNum)
				ret = aArray;
			else if (aNum > hNum)
				ret = hArray;

			return ret;
			}

		var array = teamAllocator( this["gameHandler"] );
		var arrayName = array.getIdentifier();
		var nEnt = array.addObjToArrayNextAvailable();
		//var nEnt = this["gameHandler"].getObjByName(arrayName).addObjToArrayNextAvailable();
		var index = nEnt.getIndex();

		var id = idManager.registerId(arrayName, index);
		util.log("onNewConnection: "+id);

		return id;
	}
	callbacks.register(serverNewConn, GameStructureCodes.SERVERNEWCONN);
	var serverInitPlayer = function(gsid) {

		//init conditions, send everything
		util.log("serverInitPlayer, gsid: "+gsid);
		var state = this["gameHandler"].gs;
		
		//var myArray = teamAllocator(this["gameHandler"]);
		var myArrayName = idManager.getArrayNameFromId(gsid);
		var myArray = state.entity.findChildWithIdentifier(myArrayName);
		var myIndex = idManager.getIndexFromId(gsid);

		var pEnt = myArray.children[myIndex];
		//var pEnt = this["gameHandler"].getObjByName("humanTeam").children[gsid];
		var gt = this["gameHandler"].getGameTime();
		for (var i=0; i < 1; i++) {

		var iVals = getInitValues(myArray.getIdentifier(), myIndex, gt);
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
		f.specificData = pEnt.getPath();
		//f.treeLocation = pEnt.getPath();
		//f.specificData = gsid;

	
		var msg = "p" + JSON.stringify(f);
		this["serverHandlerLink"].sendToClient(gsid, msg);
	};
	callbacks.register(serverInitPlayer, GameStructureCodes.SERVERINITPLAYER);
	var getInitValues = function(arrayName, id, ut) {
		var gsid = 0;
		var team;
		if (arrayName == "humanTeam") team = 0;
		else if (arrayName == "alienTeam") team = 2;
		else throw new Error("initValues");

		gsid = team + id;

		var x,y;
		var angle = Math.PI/2;
		if (gsid == 0) {
			x = 100; y = 100;
		} else if (gsid == 1) {
			x = 900; y = 100;
		} else if (gsid == 2) {
			x = 100; y = 900; angle*=1;
		} else if (gsid == 3) {
			x = 900; y = 900; angle*=1;
		} else throw new Error("bad initValues");

		return { p:{x:x,y:y, ut:ut}, a:{s:angle, ut:ut}, ut:ut };
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
		//var p = this["gameHandler"].getObjByName("playerArray").children[clientId];

		var arrayName = idManager.getArrayNameFromId(clientId);
		var index = idManager.getIndexFromId(clientId);

		var p = this["gameHandler"].getObjByName(arrayName).children[index];
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
