if (!this.___alexnorequire) {
	var GameStructureCodes = require("./GameStructureCodes").GameStructureCodes;
	var GameState = require("./GameState").GameState;
	var GameStateEntity = require("./GameStateEntity").GameStateEntity;
	var GameHandler = require("./GameHandler").GameHandler;
	var Prop = require("./Prop").Prop
	var util = require("util");
	
	var SailboatBridge = require("./SailboatBridge").SailboatBridge;
	var SailboatServerBehavior = require("./SailboatServerBehavior").SailboatServerBehavior;
	var SailboatSettings = require("./SailboatSettings").SailboatSettings;
}
/*
function ClientIdManager() {
	throw new Error("deprecated");
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
*/
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
Shield.prototype.checkShield = function() {
	return this.shieldUp;
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

Sailboat.getGameStateCustomizer = function() {
	var settings = SailboatSettings;
	var getShipCircle = function(radius) {
		var cm = this.findChildWithIdentifier("position").getWrappedObj();

		var x = cm.currentValues.x;
		var y = cm.currentValues.y;
		var r = radius;

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

		var cm = this.findChildWithIdentifier("position").getWrappedObj();
		var x = cm.currentValues.x; //cm.currentValues.x
		var y = cm.currentValues.y; 

		var a = cm.currentValues.angle % (2 * Math.PI);

		var ASR = settings.AlienShipRadius;
		var width = settings.AlienShieldWidthRadiusUnits*ASR;
		var height = settings.AlienShieldLengthRadiusUnits*ASR;

		var yoffset = settings.AlienShieldStartYRadiusUnits/2*ASR;
		console.log(ASR, width, height, yoffset, a);

		var rect = new SAT.Polygon(new SAT.Vector(x,y), [
			new SAT.Vector(0, -width/2),
			new SAT.Vector(height, -width/2),
			new SAT.Vector(height, width/2),
			new SAT.Vector(0, width/2)
		]);
		rect.setOffset(new SAT.Vector(yoffset,0) );

		rect.setAngle(a);

		console.log(x,y);
		console.log(rect.calcPoints);

		return rect;
	}

	var getBulletCircle = function() {
		var p = this.findChildWithIdentifier("position").getWrappedObj();
		var x = p.currentValues.x;
		var y = p.currentValues.y;
		var r = settings.BulletRadius;

		var circle = new SAT.Circle(new SAT.Vector(x,y), r);
		return circle;
	}
	var humanBoostManager = GeneralBoostManager.bind(undefined, settings.HumanMaxV, settings.HumanMaxA);
	var alienBoostManager = GeneralBoostManager.bind(undefined, settings.AlienMaxV, settings.AlienMaxA);
	var HumanShip = function(posData) {

		var ret = new GameStateEntity("humanShip");
		ret.addComponent( new GameStateEntity("position",
		new Prop.PropCircleMover(posData).setBoostManager(humanBoostManager) ).setClientProperty());

		ret.setClientProperty();
		ret.getShipCircle = getHumanShipCircle.bind(ret);

		ret.getCurrentValues = function() {
			//var ship = this.getShip();
			var p = this.findDirectChildWithIdentifier("position");
			if (p) {
				if (p.wrappedObj.currentValues) return p.wrappedObj.currentValues;
				else throw new Error("problem with currentValues");
			}
		}

		return ret;
	}
	var HumanPlayer = function() {
		var ret = new GameStateEntity("player");

		var shipArray = new GameStateEntity("shipArray");
		shipArray.addComponentArray( HumanShip, 1 );
		ret.addComponent(shipArray);

		ret.getShip = function() {
			var shipArray = this.findDirectChildWithIdentifier("shipArray");
			var ship = shipArray.children[0];
			//if (ship == undefined) throw new Error("ship problem");
			return ship;
		}.bind(ret);

		ret.getCurrentValues = function() {
			throw new Error("deprecated");
			var ship = this.getShip();
			var p = ship.findDirectChildWithIdentifier("position");
			if (p) return p.currentValues;
			else throw new Error("problem with get currentValues");
		}
		ret.applyInitialValues = function(ivals) {
			var ship = this.getShip();
			ship.getChildByIdentifier("position").applySpecificData(ivals);

		}.bind(ret);
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
		ret.setShield = function(sd) {
			var shield = this.findDirectChildWithIdentifier("shield");
			shield.applySpecificData(sd);
		}.bind(ret);
		ret.getShipCircle = getAlienShipCircle.bind(ret);
		ret.getShipAttackRect = getShipAttackRect.bind(ret);
		ret.checkShipShield = function() {
			var shield = this.findDirectChildWithIdentifier("shield");
			return shield.wrappedObj.checkShield();
		}

		ret.getCurrentValues = function() {
			//var ship = this.getShip();
			var p = this.findDirectChildWithIdentifier("position");
			if (p) {
				if (p.wrappedObj.currentValues) return p.wrappedObj.currentValues;
				else throw new Error("problem with currentValues");
			}//return p.currentValues;
			//else throw new Error("problem with get currentValues");
		}
		return ret;
		//ret.constructor.getShipCircle = getShipCircle.bind(undefined, settings.AlienShipRadius);
	}
	var AlienPlayer = function() {
		var ret = new GameStateEntity("player");

		var shipArray = new GameStateEntity("shipArray");
		shipArray.addComponentArray( AlienShip, 1 );
		ret.addComponent(shipArray);

		ret.getShip = function() {
			var shipArray = this.findDirectChildWithIdentifier("shipArray");
			var ship = shipArray.children[0];
			//if (ship == undefined) throw new Error("ship problem");
			return ship;
		}.bind(ret);
		ret.activateShield = function(gt) {
			if (console.log) console.log("activateShield");
			var ship = this.getShip();
			if (ship != undefined)
				ship.setShield({s:1, ut:gt});
		}.bind(ret);
		ret.deactivateShield = function(gt) {
			var ship = this.getShip();
			if (ship != undefined)
				ship.setShield({s:0, ut:gt});
		}.bind(ret);
		ret.checkShield = function() {
			var myShip = this.getShip();
			if (myShip)
			return myShip.checkShipShield();
		}.bind(ret);

		ret.applyInitialValues = function(ivals) {
			var ship = this.getShip();
			ship.getChildByIdentifier("position").applySpecificData(ivals);
		}.bind(ret);
		return ret;
	}
	var SABullet = function(sd) {
		var ret = new GameStateEntity("bullet");
		ret.addComponent( new GameStateEntity("position",
			new Prop.PropVector2d(sd) ) );

		ret.getBulletCircle = getBulletCircle.bind(ret);
		return ret;
	}
	

	var gameStateCustomizer = function(gs) {
		//var ret = new GameState();
		var rootEntity = gs.entity;

		var hTeam = new GameStateEntity("humanTeam");
		hTeam.addComponentArray(HumanPlayer, 0);
		rootEntity.addComponent(hTeam);


		var bulletArray = new GameStateEntity("bulletArray");
		bulletArray.addComponentArray(SABullet, 0);
		rootEntity.addComponent(bulletArray);

		var ateam = new GameStateEntity("alienTeam");
		ateam.addComponentArray(AlienPlayer, 0);
		rootEntity.addComponent(ateam);

		return gs;
	}

	return gameStateCustomizer;

	//var ret = new gameStateType;
	//var ret = {gameHandler: new GameHandler(gameStateType)};
	//if (Sailboat.Client)
	//	ret.client = new Sailboat.Client();
	//return ret;
	
}
Sailboat.gameStateCustomizer = Sailboat.getGameStateCustomizer();
Sailboat.getServerInitObj = function() {
	//---var ret = Sailboat.getInitObj();

	//return ret;
}
Sailboat.getClientInitObj = function() {
	//var ret = Sailboat.getInitObj();
	//return ret;
}
Sailboat.customizeServer = function(gameStructure) {
	SailboatBridge.Server(gameStructure["handlerBridge"]);
	SailboatServerBehavior.apply(gameStructure["serverBehavior"]);
	Sailboat.gameStateCustomizer(gameStructure["gameHandler"].gs)
	//gameStructure["gameHandler"].gs = new Sailboat.GameStateType();
}
Sailboat.customizeClient = function(gStructure) {
	SailboatBridge.Client(gStructure["handlerBridge"]);
	SailboatClientBehavior(gStructure);
	Sailboat.gameStateCustomizer(gStructure["gameHandler"].gs);
	//gameStructure["gameHandler"].gs = new Sailboat.GameStateType();
}
/*
Sailboat.Server = function(gameStructure) {


	gameStructure.clientIdManager = new ClientIdManager();
	var idManager = gameStructure.clientIdManager; //for closure

	var settings = Sailboat.settings;

	var callbacks = gameStructure.callbacks;
	var informClientId = function(hid) {
		var msg  = "i" + hid;
		this["serverHandlerLink"].sendToClient(hid, msg);
	}
	callbacks.register(informClientId.bind(gameStructure), GameStructureCodes.INFORMCLIENTID);
	var serverNewConn = function() {

	}

	callbacks.register(serverNewConn.bind(gameStructure), GameStructureCodes.SERVERNEWCONN);

	var goAlienTeam = function (id) {
		var aName = settings.AlienTeamArray;
		var array = this["gameHandler"].getObjByName(aName);
		//util.log("")
		var nEnt = array.addObjToArrayNextAvailable();
		var locStr = JSON.stringify(nEnt.getPath());
		util.log("goAlienTeam: "+locStr);

		this["serverHandlerLink"].changeHandlerId(id, locStr);
		callbacks.trigger(locStr, GameStructureCodes.SERVERINITPLAYER);

	}.bind(gameStructure);
	var goHumanTeam = function(id) {
		var aName = settings.HumanTeamArray;
		var array = this["gameHandler"].getObjByName(aName);

		var nEnt = array.addObjToArrayNextAvailable();
		var locStr = JSON.stringify(nEnt.getPath());
		util.log("goHumanTeam: "+locStr);

		this["serverHandlerLink"].changeHandlerId(id, locStr);

		callbacks.trigger(locStr, GameStructureCodes.SERVERINITPLAYER);
	}.bind(gameStructure);
	var serverCustomMsg = function(msg) {
		var c = msg.charAt(0);
		var str = msg.slice(1);

		if (c == settings.AlienTeamCode) {
			goAlienTeam(str);
		} else if (c == settings.HumanTeamCode) {
			goHumanTeam(str);
		} else
			throw new Error("bad custom msg");
		//util.log("server got custom msg: "+msg);
	}
	callbacks.register(serverCustomMsg.bind(gameStructure), GameStructureCodes.SERVERGOTCUSTOMMSG);
	var serverInitPlayer = function(locationStr) {

		//init conditions, send everything
		util.log("serverInitPlayer, gsid: "+locationStr);
		var state = this["gameHandler"].gs;
		

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
		others.setDestinationNotMe();
		util.log("other: "+JSON.stringify(others));
		this["gameHandler"].sendstate.add(others);
		
		var f = state.entity.getFrag();
		f.updateTime = gt;
		f.specificData = pEnt.getPath();
		//f.clientProperty = gsid;

	
		var msg = "p" + JSON.stringify(f);
		this["serverHandlerLink"].sendToClient(locationStr, msg);
	};
	callbacks.register(serverInitPlayer.bind(gameStructure), GameStructureCodes.SERVERINITPLAYER);
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
	
	var serverPlayerDisconnected = function(clientId) {
		util.log("child::clientDisconnected: "+clientId);
		util.log("disconnect: "+JSON.stringify(clientId));
		var p = this["gameHandler"].gs.entity.getObjFromPath(JSON.parse(clientId));
		//util.log("disconnect: "+JSON.stringify(clientId));
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
	gameStructure.updateLoopId = setInterval(updateLoop.bind(gameStructure), 40);
}

*/

if (!this.___alexnorequire) {
	exports.Sailboat = Sailboat;
	//exports.SailboatSettings = SailboatSettings;
}
