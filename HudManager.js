function HudManager() {
	this.cooldown = document.getElementById("cooldownTime");
	this.respawn = document.getElementById("respawnTime");

	this.cooldown.innerHTML = 0;
	this.respawn.innerHTML = 0;
}

HudManager.prototype.setCooldown = function(x) {
	//debugger;
	this.cooldown.innerHTML = x;
}

HudManager.prototype.setRespawn = function(x) {
	this.respawn.innerHTML = x;
}