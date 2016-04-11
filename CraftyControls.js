

function CraftyControlsManager(Crafty) {
	this.Crafty = Crafty;
	this.controlsArray = [];
}
CraftyControlsManager.prototype.checkKey = function(keyStr) { //string
	return this.Crafty.keydown[this.Crafty.keys[keyStr]];
}
CraftyControlsManager.prototype.addControl = function(control) {
	this.controlsArray.push(control);
}
CraftyControlsManager.prototype.inputUpdates = function(dt, gt) {
	for (var i=0; i < this.controlsArray.length; i++) {
		this.controlsArray[i].performInputUpdate(this.checkKey.bind(this), dt, gt);
	}
}


function CraftyControlsCircleMover(circleMoverObj, fwd, back, r, l) {
	this.fwd = fwd;
	this.back = back;
	this.r = r;
	this.l = l;

	this.controlsCircleMover = new ControlsCircleMover(circleMoverObj);
}

CraftyControlsCircleMover.prototype.performInputUpdate = function(keyChecker, dt, gt) {
	if (keyChecker(this.fwd))
		this.controlsCircleMover.boostForward(dt, gt);
	if (keyChecker(this.back))
		this.controlsCircleMover.boostBackward(dt, gt);
	if (keyChecker(this.r))
		this.controlsCircleMover.boostRight(dt, gt);
	if (keyChecker(this.l))
		this.controlsCircleMover.boostLeft(dt, gt);
}