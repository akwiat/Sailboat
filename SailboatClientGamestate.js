Sailboat.Client.registerGameStateCallbacks = function(clientBehavior) {
	var gs = clientBehavior["gameHandler"].gs;
	var callbacks = gs.callbacks;
	var graphicsObj = clientBehavior.graphics;
	var onFrame = function() {
		debugger;
		clientBehavior["gameHandler"].update();
		
	}
	
	var humanShipAdded = function(shipObj) {
		//debugger;
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

		graphicsObj.drawExplosion(shipObj);

	}
	var objRemoved = function(obj) {
		graphicsObj.removeShipObj(obj.graphicsObj);
	}
	var bulletAdded = function(bulletObj) {
		//debugger;
		console.log("bulletAdded");
		var gObj = graphicsObj.getNewBulletObj(bulletObj);
		bulletObj.setGraphicsObj(gObj);
	}

	callbacks.register(humanShipAdded, "new", "humanShip");
	callbacks.register(alienShipAdded, "new", "alienShip");
	callbacks.register(shipRemoved.bind(clientBehavior), "removed", "humanShip");
	callbacks.register(shipRemoved.bind(clientBehavior), "removed", "alienShip");

	callbacks.register(bulletAdded, "new", "bullet");
	callbacks.register(objRemoved, "removed", "bullet");

	



}
