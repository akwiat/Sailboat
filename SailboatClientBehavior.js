function SailboatClientBehavior() {
  var clientBehavior = new ClientBehavior();
  
  clientBehavior.goAlienTeam = function() {
	var code = this.gameSettings.AlienTeamCode;
	var msg = code + this.myId;
	console.log("msg: "+msg);

	this["gameStructure"].handlerBridge.sendCustomMessage(msg);

	this.uiManager.hideTeamSelect();


}
clientBehavior.goHumanTeam = function() {
	var code = this.gameSettings.HumanTeamCode;
	var msg = code + this.myId;

	this["gameStructure"].handlerBridge.sendCustomMessage(msg);
	this.uiManager.hideTeamSelect();

}
clientBehavior.onFrame = function(eventData) {

	var gt = this["gameHandler"].getGameTime();
	this.cooldownManager.onUpdate(gt);
	this.controlsManager.inputUpdates(eventData.dt/1000, gt);
	this["gameHandler"].update();
	this.checkCollisions();

}
clientBehavior.onDeadShip = function(gameStateObj) {

	var gt = this["gameHandler"].getGameTime();
	this.shotCooldown.resetCooldown();
	var ret = this.respawnCooldown.attempt(gt);
	if (ret) {
	var removeFrag = gameStateObj.getRemovalFrag();
	this["gameHandler"].officialChange(removeFrag);

	} else debugger;

  }

  return clientBehavior;
}
