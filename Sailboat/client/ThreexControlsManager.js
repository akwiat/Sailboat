function ThreexControlsManager() {
	this.keyboard = new THREEx.KeyboardState();
	this.controlsArray = [];
}
ThreexControlsManager.prototype.checkKey = function(keyStr) { //string
	//debugger;
	//var ret = this.Crafty.keydown[this.Crafty.keys[keyStr]];
	var ret = this.keyboard.pressed(keyStr);
	//debugger;
	//if (!!ret) debugger;
	return ret;
}
ThreexControlsManager.prototype.addControl = function(control) {
	this.controlsArray.push(control);
}
ThreexControlsManager.prototype.inputUpdates = function(dt, gt) {
	for (var i=0; i < this.controlsArray.length; i++) {
		this.controlsArray[i].performInputUpdate(this.checkKey.bind(this), dt, gt);
	}
}

function ThreexControlsCircleMover(circleMoverObj, fwd, back, r, l) {
	this.fwd = fwd;
	this.back = back;
	this.r = r;
	this.l = l;

	if (circleMoverObj)
		this.controlsCircleMover = new ControlsCircleMover(circleMoverObj);
}
ThreexControlsCircleMover.prototype.setCircleMoverObj = function(obj) {
	this.controlsCircleMover = new ControlsCircleMover(obj);
}
ThreexControlsCircleMover.prototype.performInputUpdate = function(keyChecker, dt, gt) {
	if (keyChecker(this.fwd))
		this.controlsCircleMover.boostForward(dt, gt);
	if (keyChecker(this.back))
		this.controlsCircleMover.boostBackward(dt, gt);
	if (keyChecker(this.r))
		this.controlsCircleMover.boostRight(dt, gt);
	if (keyChecker(this.l))
		this.controlsCircleMover.boostLeft(dt, gt);
}

function ThreexControlsAction(fn, key) {
	this.fn = fn;
	this.key = key;
}
ThreexControlsAction.prototype.performInputUpdate = function(keyChecker, dt, gt) {
	if (keyChecker(this.key)) this.fn(gt);
}

