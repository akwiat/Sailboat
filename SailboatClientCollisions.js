Sailboat.Client.prototype.checkCollisions = function() {
	var myP = this["gameHandler"].myPlayer;
	if (myP) {
		var myShip = myP.findDirectChildWithIdentifier("ship");
		var shipCircle = myShip.getShipCircle();

		var bulletArray = this.gameHandler.getObjByName("bulletArray").children;
		for (var i = 0; i < bulletArray.length; i++) {
			this.onDeadShip(myShip);
			var bullet = bulletArray[i];
			console.log(bullet);
			var bulletCircle = bullet.getBulletCircle();
			var hit = testCircleCircle(shipCircle, bulletCircle);
			if (hit) {
				this.onDeadShip(this.gameHandler.entity);
			}
		}
		
		var resp = new SAT.Response();
		SAT.testPolygonCircle(this.worldBox, shipCircle, resp)
		if (!resp.bInA) {	//collided with edge 
			this.onDeadShip(myShip);
		}
	}
}