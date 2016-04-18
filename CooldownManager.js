function GeneralCooldown(dt, onComplete, onUpdate) {
	this.waitTime = dt;
	this.onComplete = onComplete;
	this.onUpdate = onUpdate;

	this.startTime = undefined;
}
GeneralCooldown.prototype.beginCooldown = function(st) {
	this.startTime = st;
}
GeneralCooldown.prototype.resetCooldown = function() {
	this.startTime = undefined;
}
GeneralCooldown.prototype.checkTime = function(curT) {
	if (this.startTime == undefined)
		throw new Error("cooldown problem");

	var dif = curT - this.startTime;
	if ( dif > this.waitTime ) {
		if (this.onComplete)
			this.onComplete();

		this.resetCooldown();
	}

	if (dif < 0.0) dif = 0;
	return dif;
}
GeneralCooldown.prototype.onUpdate = function(curT) {
	var dif = this.checkTime(curT);
	if (this.onUpdate) this.onUpdate(dif);
}




function CooldownManager() {
	this.runningCooldowns = [];
}
CooldownManager.prototype.onUpdate = function(curT) {
	for (var i=0; i < this.runningCooldowns.length; i++) {
		this.runningCooldowns[i].onUpdate(curT);
	}
}
