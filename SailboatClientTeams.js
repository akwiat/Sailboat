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
   	//debugger;
   	if (gt == undefined) gt = this["gameHandler"].getGameTime();
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
     this.shotCooldown.resetCooldown();

/*
     var myShip = myP.getChildByIdentifier("shipArray").children[0];
	 var myShipPos = myShip.findChildWithIdentifier("position").getWrappedObj();
   	 this.controlsManager.addControl( 
				new ThreexControlsCircleMover(myShipPos, "w", "s", "d", "a")
				);
*/
   };
   this.constructor.prototype.respawnShip = humanRespawn;

   var humanShipName = function() {return "HumanShip"};
   this.constructor.prototype.getShipTypeName = humanShipName;

   var humanShoot = function(gt) {

	var res = this.shotCooldown.attempt(gt);
	if (res) {


	//debugger;
	var vMult = 1.5;
	var pMult = 100;
	//var offset = 500;
	var myP = this["gameHandler"].myPlayer;
	var pos = myP.getChildByIdentifier("position").wrappedObj;

	var vUnit = pos.getVelocityUnit();
	var vNorm = pos.position.getVelocityNorm();
	//debugger;
	var vx = vMult*vUnit.x*vNorm;
	var vy = vMult*vUnit.y*vNorm;
	var x = pos.position.x + vUnit.x*pMult;
	var y = pos.position.y + vUnit.y*pMult;
	//debugger;
	//var ut = this["gameHandler"].getGameTime();
	var sd = {x:x, y:y, vx:vx, vy:vy, ut:gt};
	//debugger;
	var nb = this["gameHandler"].officialNewObj("bulletArray", sd);
	}
	}
	this.constructor.prototype.onShoot = humanShoot;



			this.shotCooldown = new GeneralCooldown(this.gameSettings.BulletCooldown
				,undefined, this.hudManager.setCooldown.bind(this.hudManager));
			this.respawnCooldown = new GeneralCooldown(this.gameSettings.HumanRespawnCooldown
				,this.respawnShip.bind(this), this.hudManager.setRespawn.bind(this.hudManager));

			this.cooldownManager.addCooldown(this.respawnCooldown);
			this.cooldownManager.addCooldown(this.shotCooldown);
}
   
Sailboat.Client.prototype.setupAlienFunctions = function() {
	var alienRespawn = function(gt) {
		if (gt == undefined) gt = this["gameHandler"].getGameTime();
		var respawnBox = this.gameSettings.AlienRespawnBox;
		 var loc = getRandInBox(respawnBox);
     //debugger;
     var sd = {p:{x:loc.x, y:loc.y, ut:gt}, a:{s:-1.0*Math.PI/2, ut:gt}, ut:gt};
     //this["gameStructure"]["gameHandler"].myPlayer.respawnShip(sd);
     var myP = this["gameHandler"].myPlayer;

     this["gameHandler"].officialNewObj("shipArray", sd, myP);
     var myShip = myP.getChildByIdentifier("shipArray").children[0];
	 var myShipPos = myShip.findChildWithIdentifier("position").getWrappedObj();
     this.shipControl.setCircleMoverObj(myShipPos);
     this.shotCooldown.resetCooldown();
	}
	this.constructor.prototype.respawnShip = alienRespawn;
   var alienShipName = function() {return "Alien"};
   this.constructor.prototype.getShipTypeName = alienShipName;

   var alienShoot = function(gt) {
   		var res = this.shotCooldown.attempt(gt);
   		if (res) {
   			var myP = this["gameHandler"].myPlayer;
   			myP.activateShield(gt);
   		}
   }
   this.constructor.prototype.onShoot = alienShoot;


			this.shotCooldown = new GeneralCooldown(this.gameSettings.BulletCooldown
				,undefined, this.hudManager.setCooldown.bind(this.hudManager));
			this.respawnCooldown = new GeneralCooldown(this.gameSettings.AlienRespawnCooldown
				,this.respawnShip.bind(this), this.hudManager.setRespawn.bind(this.hudManager));

			this.cooldownManager.addCooldown(this.respawnCooldown);
			this.cooldownManager.addCooldown(this.shotCooldown);

}
