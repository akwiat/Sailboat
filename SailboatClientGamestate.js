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
		var team = shipObj.getIdentifier();
		if (team == "alienShip")
			this.hudManager.incrementHumanScore();
		else if (team == "humanShip")
			this.hudManager.incrementAlienScore();
		else
			throw new Error("bad team on shipRemove");

	}
	var bulletAdded = function(bulletObj) {
		//debugger;
		console.log("bulletAdded");
		var gObj = graphicsObj.getNewBulletObj(bulletObj);
		bulletObj.setGraphicsObj(gObj);
	}

	callbacks.register(humanShipAdded, "new", "humanShip");
	callbacks.register(alienShipAdded, "new", "alienShip");
	callbacks.register(shipRemoved.bind(this), "removed", "humanShip");
	callbacks.register(shipRemoved.bind(this), "removed", "alienShip");

	callbacks.register(bulletAdded, "new", "bullet");
	callbacks.register(shipRemoved.bind(this), "removed", "bullet");

	



}
