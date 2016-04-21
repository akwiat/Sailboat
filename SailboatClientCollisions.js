Sailboat.Client.prototype.checkCollisions = function() {
	console.log("checkCollisions");
	var myP = this["gameHandler"].myPlayer;
	if (!myP) return;
	var myShip = myP.findDirectChildWithIdentifier("shipArray").children[0];
	var myShip = myP.findDirectChildWithIdentifier("ship");
	if(myShip) { // myShip is not dead
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
		console.log(alienArray);
		for (var i = 0; i < alienArray.length; i++) {
			if (alienArray[i] === myP) continue;
			// if alien is attacking...
			var alienShip = alienArray[i].findDirectChildWithIdentifier("ship");
			var attackRect = alienShip.getShipAttackRect();
			var hit = SAT.testCirclePolygon(shipCircle, attackRect);
			console.log(hit);
			if (hit) {
				this.onDeadShip(myShip);
				return;
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
