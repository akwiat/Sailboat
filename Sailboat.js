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
var GeneralBoostManager = function(maxV, maxA, propPos, propAngle) {
			//var maxV = 200.0;
			//var maxA = 5.0;
			if (propPos.velX > maxV) propPos.velX = maxV;
			if (propPos.velX < -1.0*maxV) propPos.velX = -1.0*maxV;
			if (propPos.velY > maxV) propPos.velY = maxV;
			if (propPos.velY < -1.0*maxV) propPos.velY = -1.0*maxV;

			if (propAngle.velocity > maxA) propAngle.velocity = maxA;
			if (propAngle.velocity < -1.0*maxA) propAngle.velocity = -1.0*maxA;
}
function Sailboat() {}
Sailboat.settings = {
	InternalGameSize:1000
	,HumanShipRadius:25
	,AlienShipRadius:20
	,AlienShieldThicknessRadiusUnits:0.25
	//,ShipRadius:25
	,BulletRadius:20
	,BulletCooldown:2
	,AlienShieldWidthRadiusUnits:0.4
	,AlienShieldLengthRadiusUnits:3.0
	,AlienShieldStartYRadiusUnits:1.0
	,AlienShieldDuration:3
	,AlienShieldCooldown:5
	,HumanRespawnCooldown:4
	,AlienRespawnCooldown:3
	,HumanRespawnBox:{pos:{x:100,y:100}, w:800, h:100}
	,AlienRespawnBox:{pos:{x:100,y:800}, w:800, h:100}
	,HumanMaxV:200.0
	,AlienMaxV:300.0
	,AlienMaxA:7.5
	,HumanMaxA:5.0
}

Sailboat.getInitObj = function() {
	var settings = Sailboat.settings;
	var getShipCircle = function(radius) {
		var cm = this.findChildWithIdentifier("position").getWrappedObj();
		//var p = cm.position;
		var x = cm.currentValues.x;
		var y = cm.currentValues.y;
		var r = radius;
		//var r = Sailboat.settings.ShipRadius;
		//var a = cm.angle.scalarValue;
		
		var ret = new SAT.Circle(new SAT.Vector(x,y), r);
		return ret;
	}
	var getHumanShipCircle = function() {
		return getShipCircle.call(this, settings.HumanShipRadius);
	}
	var getAlienShipCircle = function() {
		return getShipCircle.call(this, settings.AlienShipRadius);
	}
	var getShipAttackRect = function() {
		// debugger;
		var cm = this.findChildWithIdentifier("position").getWrappedObj();
		var x = cm.currentValues.x; //cm.currentValues.x
		var y = cm.currentValues.y; 
		var l = settings.AlienAttackRadius;
		var a = cm.currentValues.angle.scalarValue % (2 * Math.PI);
		var rect = new SAT.Polygon(new SAT.Vector(x,y), [
			new SAT.Vector(3, 0),
			new SAT.Vector(3, l),
			new SAT.Vector(-3, l),
			new SAT.Vector(-3, 0)
		]);
		// rect.setAngle(angle) or rect.rotate(angle)
		rect.rotate(a - Math.PI / 2.0);
		// console.log(a);
		// console.log(rect.points)
		return rect;
	}

	var getBulletCircle = function() {
		var p = this.findChildWithIdentifier("position").getWrappedObj();
		var x = p.currentValues.x;
		var y = p.currentValues.y;
		var r = Sailboat.settings.BulletRadius;

		var circle = new SAT.Circle(new SAT.Vector(x,y), r);
		return circle;
	}
	var humanBoostManager = GeneralBoostManager.bind(undefined, settings.HumanMaxV, settings.HumanMaxA);
	var alienBoostManager = GeneralBoostManager.bind(undefined, settings.AlienMaxV, settings.AlienMaxA);
	var HumanShip = function(posData) {

		var ret = new GameStateEntity("humanShip");
		ret.addComponent( new GameStateEntity("position",
		new Prop.PropCircleMover(posData).setBoostManager(humanBoostManager) ).setClientProperty());
/*
		ret.addComponent( new GameStateEntity("shield",
			new Shield() ).setClientProperty()
			);
*/		
		//ret.shipRadius = 25;
		ret.setClientProperty();
		ret.constructor.prototype.getShipCircle = getHumanShipCircle;
		return ret;
	}
	var HumanPlayer = function() {
		var ret = new GameStateEntity("player");

		var shipArray = new GameStateEntity("shipArray");
		shipArray.addComponentArray( HumanShip, 1 );
		ret.addComponent(shipArray);

		ret.constructor.prototype.getShip = function() {
			var shipArray = this.findDirectChildWithIdentifier("shipArray");
			var ship = shipArray.children[0];
			if (ship == undefined) throw new Error("ship problem");
			return ship;
		}
		return ret;
	}
	var AlienShip = function(posData) {
		var ret = new GameStateEntity("alienShip");

		var posEntity = new GameStateEntity("position", 
			new Prop.PropCircleMover(posData).setBoostManager(alienBoostManager) );
		posEntity.setClientProperty();
		ret.addComponent(posEntity);

		var shieldEntity = new GameStateEntity("shield", new Shield() );
		shieldEntity.setClientProperty();
		ret.addComponent(shieldEntity);

		ret.setClientProperty();
		ret.constructor.prototype.setShield = function(sd) {
			var shield = this.findDirectChildWithIdentifier("shield");
			shield.applySpecificData(sd);
		}
		ret.constructor.prototype.getShipCircle = getAlienShipCircle;
		ret.constructor.prototype.getShipAttackRect = getShipAttackRect;
		return ret;
		//ret.constructor.prototype.getShipCircle = getShipCircle.bind(undefined, settings.AlienShipRadius);
	}
	var AlienPlayer = function() {
		var ret = new GameStateEntity("player");

		var shipArray = new GameStateEntity("shipArray");
		shipArray.addComponentArray( AlienShip, 1 );
		ret.addComponent(shipArray);

		ret.constructor.prototype.getShip = function() {
			var shipArray = this.findDirectChildWithIdentifier("shipArray");
			var ship = shipArray.children[0];
			if (ship == undefined) throw new Error("ship problem");
			return ship;
		}
		ret.constructor.prototype.activateShield = function(gt) {
			var ship = this.getShip();
			ship.setShield({s:1, ut:gt});
		}
		ret.constructor.prototype.deactivateShield = function(gt) {
			var ship = this.getShip();
			ship.setShield({s:0, ut:gt});
		}
		ret.constructor.prototype.checkShield = function() {
			var ship = this.getShip();
			return shield.shieldUp;
		}
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
	/*
	var SAPlayer = function() {
		var ret = new GameStateEntity("player");

		var shipArray = new GameStateEntity("shipArray");
		shipArray.addComponentArray( SAShip, 1 );
		ret.addComponent(shipArray);

		/*
		var respawnShip = function(sd) {
			
			var nShip = new SAShip();
			nShip.findChildWithIdentifier("position").wrappedObj.applySpecificData(sd);
			this.addComponent( nShip );
			

			//debugger;
		}
		ret.constructor.prototype.respawnShip = respawnShip;
		* /
		return ret;
	}
	*/
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
		hTeam.addComponentArray(HumanPlayer, 0);
		rootEntity.addComponent(hTeam);


		/*
		var playerArray = new GameStateEntity("playerArray");
		playerArray.addComponentArray(SAPlayer, 0);
		ret.entity.addComponent(playerArray);
		*/
		var bulletArray = new GameStateEntity("bulletArray");
		bulletArray.addComponentArray(SABullet, 0);
		rootEntity.addComponent(bulletArray);

		var ateam = new GameStateEntity("alienTeam");
		ateam.addComponentArray(AlienPlayer, 0);
		rootEntity.addComponent(ateam);

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
				ret = aArray;
			else if (hNum > aNum)
				ret = aArray;
			return ret;
		};

		var array = teamAllocator( this["gameHandler"]);
		var arrayName = array.getIdentifier();
		var nEnt = array.addObjToArrayNextAvailable();
		console.log(nEnt);
		//var nEnt = this["gameHandler"].getObjByName(arrayName).addObjToArrayNextAvailable();
		//var index = nEnt.getIndex();

		//var id = idManager.registerId(arrayName, index);
		var locStr = JSON.stringify(nEnt.getPath());
		util.log("onNewConnection: "+locStr);

		return locStr;
	}
	callbacks.register(serverNewConn, GameStructureCodes.SERVERNEWCONN);
	var serverInitPlayer = function(locationStr) {

		//init conditions, send everything
		util.log("serverInitPlayer, gsid: "+locationStr);
		var state = this["gameHandler"].gs;
		
		//var myArray = teamAllocator(this["gameHandler"]);
		//var myArrayName = idManager.getArrayNameFromId(gsid);
		//var myArray = state.entity.finDirectdChildWithIdentifier(myArrayName);
		//var myIndex = idManager.getIndexFromId(gsid);
		var loc = JSON.parse(locationStr);
		var pEnt = state.entity.getObjFromPath(loc);
		var arrayIdentifier = pEnt.parent.getIdentifier();
		//var pEnt = myArray.children[myIndex];
		
		var gt = this["gameHandler"].getGameTime();
		for (var i=0; i < 1; i++) {

		var iVals = getInitValues(arrayIdentifier, pEnt.getIndex(), gt);
		
		

		
		var ship = pEnt.getChildByIdentifier("shipArray").children[0];
		ship.getChildByIdentifier("position").applySpecificData(iVals);
		//ship.getChildByIdentifier("shield").applySpecificData({ut:gt});

		}
		var others = pEnt.getSpecificFrag();
		util.log("other: "+JSON.stringify(others));
		this["gameHandler"].sendstate.add(others);
		
		var f = state.entity.getFrag();
		f.updateTime = gt;
		f.specificData = pEnt.getPath();
		//f.clientProperty = gsid;

	
		var msg = "p" + JSON.stringify(f);
		this["serverHandlerLink"].sendToClient(locationStr, msg);
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
			x = 100; y = 900; angle*=-1;
		} else if (gsid == 3) {
			x = 900; y = 900; angle*=-1;
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

		//var arrayName = idManager.getArrayNameFromId(clientId);
		//var index = idManager.getIndexFromId(clientId);

		//var p = this["gameHandler"].getObjByName(arrayName).children[index];
		util.log("disconnect: "+JSON.stringify(clientId));
		var p = this["gameHandler"].gs.entity.getObjFromPath(JSON.parse(clientId));
		util.log("disconnect: "+JSON.stringify(clientId));
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
	gameStructure.updateLoopId = setInterval(updateLoop.bind(gameStructure), 1000);
}



if (!this.___alexnorequire) {
	exports.Sailboat = Sailboat;
}
