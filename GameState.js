if (!this.___alexnorequire) {
	var Callbacks = require("./Callbacks").Callbacks;
	var GameStateEntity = require("./GameStateEntity").GameStateEntity;
}

function GameState() {

	//this.stateprops = {};
	this.entity = new GameStateEntity("gameState");
	this.callbacks = new Callbacks();

}
/*
GameState.prototype.addEverything = function(difObj) {
	for (var o of this.stateprops) {
		difObj.add(o.getFrag());
	}
}
*/
GameState.prototype.applyFrag = function(frag) {
	/*
	if (console)
		console.log(frag);
	*/
	this.entity.applyFrag(frag, this.callbacks);
}
GameState.prototype.applyObjFormDifObj = function(obj) {
	var difObj = DifferenceObj.makeFromObj(obj);
	this.applyDifObj(difObj);
}
GameState.prototype.applyDifObj = function(difobj) {
  //var updatetime = difobj.timestamp;
	for (var i=0,l=difobj.fraglist.length;i<l;i++) {
		var frag = difobj.fraglist[i];
		/*
		if (frag) { //if there is no timestamp, use the difobj's timestamp
			if (frag.updateTime == undefined)
				frag.updateTime = updatetime;
			*/
		this.applyFrag(frag);
		
	}
}

GameState.prototype.update = function(curtime, shouldUpdateGraphics) {
	this.entity.propagate(curtime, shouldUpdateGraphics);
}
GameState.prototype.clear = function() {
	this.entity.clear();
}

if (!this.___alexnorequire) {
	exports.GameState = GameState
	
}