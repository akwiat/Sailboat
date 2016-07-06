function ServerBehavior(settings) {
  this.settings = settings;
}

ServerBehavior.prototype.receiveAndPassUpdate = function() { this["gameHandler"].receiveAndPassUpdate.apply(this["gameHandler"], arguments);}
ServerBehavior.prototype.sendUpdateToAllClients = function() {
  var difObj = this["gameHandler"].pullSendstate();
  this["handlerBridge"].sendObjectToAllClients(difObj);
  difObj.clear();
}

ServerBehavior.prototype.getInitValues = function(arrayIdentifier, pEnt.getIndex(), gt) {
  throw new Error("should override getInitValues");
}
ServerBehavior.prototype.serverInitPlayer = function(locationStr) {
    var state = this["gameHandler"].gs;
		
		var loc = JSON.parse(locationStr);
		var pEnt = state.entity.getObjFromPath(loc);
		
		
		var arrayIdentifier = pEnt.parent.getIdentifier();
		//var pEnt = myArray.children[myIndex];
		
		var gt = this["gameHandler"].getGameTime();

		var iVals = this.getInitValues(arrayIdentifier, pEnt.getIndex(), gt);
		
		pEnt.applySpecificData(iVals);
		

		
		//var ship = pEnt.getChildByIdentifier("shipArray").children[0];
		//ship.getChildByIdentifier("position").applySpecificData(iVals);

		var others = pEnt.getSpecificFrag();
		others.setDestinationNotMe();
		util.log("other: "+JSON.stringify(others));
		this["gameHandler"].sendstate.add(others);
		
		var f = state.entity.getFrag();
		f.updateTime = gt;
		f.specificData = pEnt.getPath();
		//f.clientProperty = gsid;

	
		var msg = "p" + JSON.stringify(f);
		this["handlerBridge"].sendToClient(locationStr, msg);
}
ServerBehavior.prototype.serverClientDisconnected = function(clientId) {
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
ServerBehavior.prototype.updateLoop = function() {
	var difObj = this["gameHandler"].sendstate;
	this["handlerBridge"].sendUpdateToAllClients(difObj);
}
ServerBehavior.prototype.activate = function() {
	if (this.updateLoopId == undefined) {
	  var updateLoopTime = this.settings.ServerUpdateLoopPeriod;
	  if (updateLoopTime == undefined) updateLoopTime = 40;
	  this.updateLoopId = setInterval(this.updateLoop.bind(this), updateLoopTime);
	}
}
ServerBehavior.prototype.deactivate = function() {
	clearInterval(this.updateLoopId);
}
}
if (!this.___alexnorequire) {
	exports.ServerBehavior = ServerBehavior;
}
