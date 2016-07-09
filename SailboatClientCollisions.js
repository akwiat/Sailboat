Sailboat.Client.initializeCollisions = function(clientBehavior) {
	var checkCollisions = function() {
	var myP = this["gameHandler"].myPlayer;
	if (!myP) return;
	var myShip = myP.findDirectChildWithIdentifier("shipArray").children[0];
	if(myShip) { // myShip is not dead
		if (myShip.checkShipShield) {
			var s = myShip.checkShipShield();
			if (s) return;
		}

		var shipCircle = myShip.getShipCircle();

		// check myShip collision with any bullets
		var bulletArray = this.gameHandler.getObjByName("bulletArray").children;
		for (var i = 0; i < bulletArray.length; i++) {
			var bullet = bulletArray[i];
			var bulletCircle = bullet.getBulletCircle();
			var hit = SAT.testCircleCircle(shipCircle, bulletCircle);
			if (hit) {
				this.onDeadShip(myShip);
				return;
			}
		}

		// check myShip collision with any attacking aliens
		var alienArray = this["gameHandler"].getObjByName("alienTeam").children;
		for (var i = 0; i < alienArray.length; i++) {

			var alienPlayer = alienArray[i];
			if (alienPlayer == undefined) continue;
			if (alienArray[i] === myP) continue;
			var shield = alienArray[i].checkShield();
			if (!shield) continue;
			console.log("checking shields");
			// if alien is attacking...
			var alienShip = alienArray[i].findDirectChildWithIdentifier("shipArray").children[0];
			var alienCircle = alienShip.getShipCircle();
			var attackRect = alienShip.getShipAttackRect();
			var hit = SAT.testCircleCircle(shipCircle, alienCircle);
			if (hit) {
				this.onDeadShip(myShip);
				return;
			} else {
				var hit2 = SAT.testPolygonCircle(attackRect, shipCircle)
				if (hit2) {
					this.onDeadShip(myShip);
					return;
				}
			}
		}

		// check myShip collision with edge
		var resp = new SAT.Response();
		SAT.testPolygonCircle(this.worldBox, shipCircle, resp);
		if (!resp.bInA) {	//collided with edge 
			this.onDeadShip(myShip);
			return;
		}
	}
}
clientBehavior.checkCollisions = checkCollisions;
}
