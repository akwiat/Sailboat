function GeneralCooldown(dt, onComplete, ou) {
	this.waitTime = dt;
	this.onComplete = onComplete;
	this.updateFn = ou;

	this.startTime = undefined;
}
GeneralCooldown.prototype.attempt = function(gt) {
	if (!gt) debugger;
	if (this.isActive()) return false;
	else this.beginCooldown(gt);

	return true;
}
GeneralCooldown.prototype.isActive = function() {
	return (this.startTime);
}
GeneralCooldown.prototype.beginCooldown = function(st) {
	//debugger;
	this.startTime = st;
}
GeneralCooldown.prototype.resetCooldown = function() {
	this.startTime = undefined;
}
GeneralCooldown.prototype.checkTime = function(curT) {
	if (this.startTime == undefined)
		throw new Error("cooldown problem");

	var remaining = this.startTime - curT + this.waitTime;
	if ( remaining <= 0 ) {
		if (this.onComplete)
			this.onComplete();

		this.resetCooldown();
	}

	if (remaining < 0.0) remaining = 0.0;
	return remaining;
}
GeneralCooldown.prototype.onUpdate = function(curT) {
	//debugger;
	if (this.isActive()) {
		//debugger;
	var remaining = this.checkTime(curT);
	if (this.onUpdate) this.updateFn(remaining);
	}
}




function CooldownManager() {
	this.runningCooldowns = [];
}
CooldownManager.prototype.onUpdate = function(curT) {
	for (var i=0; i < this.runningCooldowns.length; i++) {
		this.runningCooldowns[i].onUpdate(curT);
	}
}
CooldownManager.prototype.addCooldown = function(c) {
	this.runningCooldowns.push(c);
}
