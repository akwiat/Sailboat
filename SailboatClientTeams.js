Sailboat.Client.initializeTeamBehavior = function(clientBehavior) {



var getRandInRange = function(start, range) {
  return Math.random()*(range) + start;
}
var getRandInBox = function(box) {
  var x = getRandInRange(box.pos.x, box.w);
  var y = getRandInRange(box.pos.y, box.h);
  return {x:x, y:y};
}
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
var humanShipName = function() {return "HumanShip"};
var humanShoot = function(gt) {
    console.log("humanShoot");
  var res = this.shotCooldown.attempt(gt);
  if (res) {


  //debugger;
  var vMult = 1.5;
  var pMult = 70;
  //var offset = 500;
  var myP = this["gameHandler"].myPlayer;
  var posEntity = myP.getChildByIdentifier("position");
  if (!posEntity) return;
  var pos = posEntity.wrappedObj;
  //.wrappedObj;

  var vUnit = pos.getVelocityUnit();
  var vNorm = pos.position.getVelocityNorm();

  if (vNorm < 10) vNorm = 10;
  //debugger;
  var vx = vMult*vUnit.x*vNorm;
  var vy = vMult*vUnit.y*vNorm;
  var x = pos.currentValues.x + vUnit.x*pMult;
  var y = pos.currentValues.y + vUnit.y*pMult;
  //var x = pos.position.x + vUnit.x*pMult;
  //var y = pos.position.y + vUnit.y*pMult;

  var sd = {x:x, y:y, vx:vx, vy:vy, ut:gt};
  //debugger;
  var nb = this["gameHandler"].officialNewObj("bulletArray", sd);
  }
  }
  var humanControls = function(control) {
    var cmc = control.controlsCircleMover;
    cmc.accFwd = settings.HumanAccFwd;
    cmc.accBack = cmc.accFwd;

    cmc.accRight = settings.HumanAccRight;
    cmc.accLeft = cmc.accRight;

  }

  var alienRespawn = function(gt) {
    if (gt == undefined) gt = this["gameHandler"].getGameTime();
    var respawnBox = this.gameSettings.AlienRespawnBox;
     var loc = getRandInBox(respawnBox);
     //debugger;
     console.log("gameTime respawn: "+gt);
     //debugger;
     var sd = {p:{x:loc.x, y:loc.y, ut:gt}, a:{s:-1.0*Math.PI/2, ut:gt}, ut:gt};
     //this["gameStructure"]["gameHandler"].myPlayer.respawnShip(sd);
     var myP = this["gameHandler"].myPlayer;

     this["gameHandler"].officialNewObj("shipArray", sd, myP);
     var myShip = myP.getChildByIdentifier("shipArray").children[0];
   var myShipPos = myShip.findChildWithIdentifier("position").getWrappedObj();
     this.shipControl.setCircleMoverObj(myShipPos);
     this.shotCooldown.resetCooldown();
     //this.shotTimer.resetCooldown();
  }
  var alienShipName = function() {return "Alien"};
clientBehavior.setupTeamFunctions = function(arrayName) {
  var hArray = "humanTeam";
  var aArray = "alienTeam";
  var isHuman;
  if (arrayName == hArray) 
    this.setupHumanFunctions();
  else if (arrayName == aArray)
    this.setupAlienFunctions();
  else throw new Error("setupTeamFunctions");
  
}

clientBehavior.setupHumanFunctions = function() {
	var settings = this.gameSettings;
   
  this.respawnShip = humanRespawn;
  this.getShipTypeName = humanShipName;
	this.onShoot = humanShoot;
	this.teamSpecificControls = humanControls;

			this.shotCooldown = new GeneralCooldown(this.gameSettings.BulletCooldown
				,undefined, this.hudManager.setCooldown.bind(this.hudManager));
			this.respawnCooldown = new GeneralCooldown(this.gameSettings.HumanRespawnCooldown
				,this.respawnShip.bind(this), this.hudManager.setRespawn.bind(this.hudManager));

			this.cooldownManager.addCooldown(this.respawnCooldown);
			this.cooldownManager.addCooldown(this.shotCooldown);
}
   
clientBehavior.setupAlienFunctions = function() {
	var settings = this.gameSettings;
	
	clientBehavior.respawnShip = alienRespawn;
   clientBehavior.getShipTypeName = alienShipName;

   var alienShoot = function(gt) {
   		var ship = this["gameHandler"].myPlayer.getShip();
   		if (!ship) return;
      var res = this.shotCooldown.attempt(gt);
      if (res) {
        var myP = this["gameHandler"].myPlayer;
        myP.activateShield(gt);
      }
   }
   clientBehavior.onShoot = alienShoot;


   	var alienControls = function(control) {
		var cmc = control.controlsCircleMover;
		cmc.accFwd = settings.AlienAccFwd;
		cmc.accBack = cmc.accFwd;

		cmc.accRight = settings.AlienAccRight;
		cmc.accLeft = cmc.accRight;

	}
	this.teamSpecificControls = alienControls;

   console.log('sdf');
   this.shotCooldown = new DoubleCooldown(
    this.gameSettings.BulletCooldown,
    this["gameHandler"].myPlayer.deactivateShield.bind(this["gameHandler"].myPlayer),
    this.hudManager.setCooldown.bind(this.hudManager),
    this.gameSettings.BulletCooldown, 
    undefined,
    this.hudManager.setCooldown.bind(this.hudManager)
    )

      // this.shotTimer = new GeneralCooldown(this.gameSettings.BulletCooldown
      //   ,this.shieldDownAndCooldown.bind(this), undefined);
      // this.shotCooldown = new GeneralCooldown(this.gameSettings.BulletCooldown
      //   ,undefined, this.hudManager.setCooldown.bind(this.hudManager));
      this.respawnCooldown = new GeneralCooldown(this.gameSettings.AlienRespawnCooldown
        ,this.respawnShip.bind(this), this.hudManager.setRespawn.bind(this.hudManager));

      // this.cooldownManager.addCooldown(this.shotTimer);
      this.cooldownManager.addCooldown(this.shotCooldown);
			this.cooldownManager.addCooldown(this.respawnCooldown);

}

}
