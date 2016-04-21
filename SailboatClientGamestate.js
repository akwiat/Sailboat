Sailboat.Client.prototype.registerGameStateCallbacks = function() {
	var gs = this["gameHandler"].gs;
	var callbacks = gs.callbacks;
	var graphicsObj = this.graphics;
	var onFrame = function() {
		debugger;
		this["gameHandler"].update();
		
	}
	
	var humanShipAdded = function(shipObj) {

		var gObj = graphicsObj.getNewHumanShip(shipObj);
		shipObj.setGraphicsObj(gObj);

	}
	var alienShipAdded = function(shipObj) {
		var gObj = graphicsObj.getNewAlienShip(shipObj);
		shipObj.setGraphicsObj(gObj);
	}

	var shipRemoved = function(shipObj) {
		//console.log("shipRemoved");
		graphicsObj.removeShipObj(shipObj.graphicsObj);

	}
	var bulletAdded = function(bulletObj) {
		//debugger;
		console.log("bulletAdded");
	var gObj = graphicsObj.getNewBulletObj(bulletObj);
		bulletObj.setGraphicsObj(gObj);
	}
	callbacks.register(humanShipAdded, "new", "humanShip");
	callbacks.register(alienShipAdded, "new", "alienShip");
	callbacks.register(shipRemoved, "removed", "humanShip");
	callbacks.register(shipRemoved, "removed", "alienShip");

	callbacks.register(bulletAdded, "new", "bullet");
	callbacks.register(shipRemoved, "removed", "bullet");
	//callbacks.register()



}
