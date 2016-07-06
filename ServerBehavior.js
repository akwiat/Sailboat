function ServerBehavior() {

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
if (!this.___alexnorequire) {
	exports.ServerBehavior = ServerBehavior;
}
