function HudManager(cooldownId, respawnId) {
	this.cooldown = document.getElementById(cooldownId);
	this.respawn = document.getElementById(respawnId);

	this.cooldown.innerHTML = 0;
	this.respawn.innerHTML = 0;
}

HudManager.prototype.setCooldown = function(x) {
	this.cooldown.innerHTML = x;
}

HudManager.prototype.setCooldown = function(x) {
	this.respawn.innerHTML = x;
}