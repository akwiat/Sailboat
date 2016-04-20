Sailboat.Client.prototype.checkCollisions = function() {
	var myP = this["gameHandler"].myPlayer;
	if (myP) {
		//var myShip = myP.findDirectChildWithIdentifier("ship");
		var myShip = myP.findDirectChildWithIdentifier("shipArray").children[0];
		if(myShip) {
			var shipCircle = myShip.getShipCircle();

			var bulletArray = this.gameHandler.getObjByName("bulletArray").children;
			for (var i = 0; i < bulletArray.length; i++) {
				var bullet = bulletArray[i];
				var bulletCircle = bullet.getBulletCircle();
				var hit = SAT.testCircleCircle(shipCircle, bulletCircle);
				if (hit) {
					this.onDeadShip(myShip);
				}
			}
			
			var resp = new SAT.Response();
			SAT.testPolygonCircle(this.worldBox, shipCircle, resp)
			if (!resp.bInA) {	//collided with edge 
				this.onDeadShip(myShip);
			}
		}
	}
}