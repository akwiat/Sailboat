if (!this.___alexnorequire) {
  var ServerBehavior = require("./ServerBehavior").ServerBehavior;
  var Sailboat = require("./Sailboat").Sailboat;
}

function SailboatServerBehavior() {
  var serverBehavior = new ServerBehavior();
  var settings = Sailboat.settings;
  serverBehavior.goAlienTeam = function (id) {
	  	var aName = settings.AlienTeamArray;
		  var array = this["gameHandler"].getObjByName(aName);
		  //util.log("")
	  	var nEnt = array.addObjToArrayNextAvailable();
	  	var locStr = JSON.stringify(nEnt.getPath());
		  util.log("goAlienTeam: "+locStr);

		  this["handlerBridge"]["serverHandlerLink"].changeHandlerId(id, locStr);
	  	//callbacks.trigger(locStr, GameStructureCodes.SERVERINITPLAYER);
	  	this.serverInitPlayer(locStr);

	  }
	serverBehavior.goHumanTeam = function(id) {
		var aName = settings.HumanTeamArray;
		var array = this["gameHandler"].getObjByName(aName);

		var nEnt = array.addObjToArrayNextAvailable();
		var locStr = JSON.stringify(nEnt.getPath());
		util.log("goHumanTeam: "+locStr);

		this["handlerBridge"]["serverHandlerLink"].changeHandlerId(id, locStr);

		//callbacks.trigger(locStr, GameStructureCodes.SERVERINITPLAYER);
		this.serverInitPlayer(locStr);
	}
	serverBehavior.getInitValues = function(arrayName, id, ut) {
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
	
  serverBehavior.gameStructureHasInitialized = function(gameStructure) {
  
    var settings = Sailboat.settings;

  	var callbacks = gameStructure.callbacks;
  	/*
   	var informClientId = function(hid) {
	   	var msg  = "i" + hid;
	  	this["serverHandlerLink"].sendToClient(hid, msg);
  	}
	  callbacks.register(informClientId.bind(gameStructure), GameStructureCodes.INFORMCLIENTID);
	*/


	/*
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
	*/
	//callbacks.register(serverCustomMsg.bind(gameStructure), GameStructureCodes.SERVERGOTCUSTOMMSG);
	/*
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
	*/
	/*
	var updateLoop = function() {
		var difObj = this["gameHandler"].sendstate;
		this["handlerBridge"].sendUpdateToAllClients(difObj);
	}
	gameStructure.updateLoopId = setInterval(updateLoop.bind(gameStructure), 40);
	*/
  }
}
if (!this.___alexnorequire) {
	exports.SailboatServerBehavior = SailboatServerBehavior;
}
