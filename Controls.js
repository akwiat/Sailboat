function ControlsCircleMover(circleMover) {
	this.accFwd = 40.0/1000;
	this.accBack = this.accFwd;
	this.accRight = 1.0/1000; //radians per sec per sec
	this.accLeft = this.accRight;


	this.circleMover = circleMover;
}

ControlsCircleMover.prototype.boostForward = function(dt, gt) { //in seconds, in ms
	this.circleMover.boostVelocity(dt*this.accFwd, gt);
}

ControlsCircleMover.prototype.boostBackward = function(dt, gt) {
	this.circleMover.boostVelocity(-1.0*dt*this.accBack, gt);
}
ControlsCircleMover.prototype.boostRight = function(dt, gt) {
	this.circleMover.boostAngle(dt*this.accRight, gt);
}
ControlsCircleMover.prototype.boostLeft = function(dt, gt) {
	this.circleMover.boostAngle(-1.0*dt*this.accLeft, gt);
}
