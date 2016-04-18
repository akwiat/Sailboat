function HudManager(cooldownId, respawnId) {
	this.cooldown = document.getElementById("cooldownTime");
	this.respawn = document.getElementById("respawnTime");
}

HudManager.prototype.setCooldown = function(x) {
	this.cooldown.innerHTML = x;
}

HudManager.prototype.setCooldown = function(x) {
	this.respawn.innerHTML = x;
}