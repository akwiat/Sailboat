Sailboat.Client.prototype.checkCollisions = function() {
	var myP = this["gameHandler"].myPlayer;
	if (myP) {
	var myShip = myP.findChildWithIdentifier("ship");
	var circle = myShip.getShipCircle();
	
	var resp = new SAT.Response();
	SAT.testPolygonCircle(this.worldBox, circle, resp)
	if (!resp.bInA) debugger; //collided with edge
	}
	
}
