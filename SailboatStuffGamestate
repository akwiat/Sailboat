Sailboat.Client.prototype.registerGameStateCallbacks = function() {
	var gs = this["gameHandler"].gs;
	var callbacks = gs.callbacks;
	var graphicsObj = this.graphics;
	var onFrame = function() {
		debugger;
		this["gameHandler"].update();
		
	}
	
	var shipAdded = function(shipObj) {

		var gObj = graphicsObj.getNewShipObj(shipObj);
		shipObj.setGraphicsObj(gObj);

	}

	var shipRemoved = function(shipObj) {
		//console.log("shipRemoved");
		graphicsObj.removeShipObj(shipObj.graphicsObj);

	}
	callbacks.register(shipAdded, "new", "ship");
	callbacks.register(shipRemoved, "removed", "ship");
	//callbacks.register(bulletAdded, "new", "bullet");
	//callbacks.register(bulletRemoved, "removed", "bullet");



}
