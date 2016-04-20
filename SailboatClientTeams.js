var getRandInRange = function(start, range) {
  return Math.random()*(range) + start;
}
var getRandInBox = function(box) {
  var x = getRandInRange(box.pos.x, box.w);
  var y = getRandInRange(box.pos.y, box.h);
  return {x:x, y:y};
}
Sailboat.Client.prototype.setupTeamFunctions = function(arrayName) {
  var hArray = "humanTeam";
  var aArray = "alienTeam";
  var isHuman;
  if (arrayName == hArray) 
    this.setupHumanFunctions();
  else if (arrayName == aArray)
    this.setupAlienFunctions();
  else throw new Error("setupTeamFunctions");
  
}

Sailboat.Client.prototype.setupHumanFunctions = function() {
   var humanRespawn = function(gt) {
     var respawnBox = this.gameSettings.HumanRespawnBox;
     var loc = getRandInBox(respawnBox);
     //debugger;
     var sd = {p:{x:loc.x, y:loc.y, ut:gt}, a:{s:Math.PI/2, ut:gt}, ut:gt};
     //this["gameStructure"]["gameHandler"].myPlayer.respawnShip(sd);
     var myP = this["gameHandler"].myPlayer;

     this["gameHandler"].officialNewObj("shipArray", sd, myP);
     var myShip = myP.getChildByIdentifier("shipArray").children[0];
	 var myShipPos = myShip.findChildWithIdentifier("position").getWrappedObj();
     this.shipControl.setCircleMoverObj(myShipPos);

/*
     var myShip = myP.getChildByIdentifier("shipArray").children[0];
	 var myShipPos = myShip.findChildWithIdentifier("position").getWrappedObj();
   	 this.controlsManager.addControl( 
				new ThreexControlsCircleMover(myShipPos, "w", "s", "d", "a")
				);
*/
   };
   this.constructor.prototype.respawnShip = humanRespawn;
   
}
