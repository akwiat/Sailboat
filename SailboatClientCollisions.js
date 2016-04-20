Sailboat.Client.prototype.checkCollisions = function() {
	var myP = this["gameHandler"].myPlayer;
	if (!myP) return;

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
		for (var i = 0; i < alienArray; i++) {
			var alien = alienArray[i];
			var attackRect = alien.getShipAttackRect();
			var hit = SAT.testCirclePolygon(shipCircle, attackRect);
			if (hit) {
				this.onDeadShip(myShip);
				return;
			}
		}

		var resp = new SAT.Response();
		SAT.testPolygonCircle(this.worldBox, shipCircle, resp);
		if (!resp.bInA) {	//collided with edge 
			this.onDeadShip(myShip);
			return;
		}
	}
}
