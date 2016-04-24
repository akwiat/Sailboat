function HudManager() {
	this.cooldown = document.getElementById("cooldownTime");
	this.respawn = document.getElementById("respawnTime");
	this.score = document.getElementById("scoreHud");

	this.cooldown.innerHTML = 0;
	this.respawn.innerHTML = 0;
	this.scoreAliens = 0;
	this.scoreHumans = 0;
	this.updateScore();
	//this.score.innerHTML = "Humans: 0, Aliens: 0";


}

HudManager.prototype.setCooldown = function(x) {
	this.cooldown.innerHTML = x.toString().substring(0,3);
}

HudManager.prototype.setRespawn = function(x) {
	this.respawn.innerHTML = x;
}
HudManager.prototype.incrementHumanScore = function() {
	this.scoreHumans++;
	this.updateScore();

}
HudManager.prototype.incrementAlienScore = function() {
	this.scoreAliens++;
	this.updateScore();
}
HudManager.prototype.updateScore = function() {
	this.score.innerHTML = "Humans: "+ this.scoreHumans+ ", Aliens: "+this.scoreAliens;
}