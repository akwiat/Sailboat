/*
function Propagating(data, ts) {
	this.timestamp = (ts !== undefined)? ts : 0.0
	this.data = data
}

Propagating.prototype.propagate = function(t) {
	for (v in this.data) {
		this.v.propagate(t)
	}
}
*/
function Prop() {
}
Prop.applyData = function(obj) {
	var applied = false;
	for (var i in obj) {
		if (obj.hasOwnProperty(i)) {
			if (obj[i] !== undefined) {
			this[i] = obj[i];
			applied = true;
			}
		}
	}
	/*
	if (updateTime == undefined)
		throw new Error("Prop::applyData bad updateTime");

	if (applied) { //if you did anything, set the updateTime
	if (this.setUpdateTime != undefined)
		this.setUpdateTime(updateTime);
	else
		this.updateTime = updateTime;
	}
	*/
	return applied;
}
 Prop.PropVector2d = function(sd) {
	this.x = 0.0;
	this.y = 0.0;

	this.velX = 0.0;
	this.velY = 0.0;

	this.updateTime = undefined;
	this.applySpecificData(sd);
	//Prop.applyData.call(this, sd);
}
/*
Prop.PropVector2d.prototype.setValues = function(x,y) {
	this.x = x; this.y = y;
}
Prop.PropVector2d.prototype.setVelocity = function(vx,vy){
	this.velX = vx; this.velY = vy;
}
Prop.PropVector2d.prototype.setUpdateTime = function(t) {
	this.updateTime = t;
}
*/
/*
Prop.PropVector2d.prototype.stripData = function() {
	this.x = undefined;
	this.y = undefined;
	this.velX = undefined;
	this.velY = undefined;
}
Prop.PropVector2d.prototype.applySpecificData = function(obj) {
	if (obj == undefined) return;
	//return Prop.applyData.apply(this, arguments);
	//debugger;
	/*
	if (obj.ut == undefined)
		debugger;
	* /
	if (obj.x != undefined)
		this.x = obj.x;
	if (obj.y != undefined)
		this.y = obj.y;
	if (obj.vx != undefined)
		this.velX = obj.vx;
	if (obj.vy != undefined)
		this.velY = obj.vy;
	if (obj.ut != undefined)
		this.updateTime = obj.ut;
	return this;
}
Prop.PropVector2d.prototype.getSpecificData = function() {
	var fixed = 1;
	var myround = function(num) {
		if (num == undefined)
			debugger;
		return Math.round(num*1000)/1000;
	}
	return {x:myround(this.x), 
			y:myround(this.y), 
			vx:myround(this.velX), 
			vy:myround(this.velY), 
			ut:this.updateTime};
	//return this;
}
Prop.PropVector2d.prototype.propagate = function(t) {
	if (this.updateTime == undefined){
		if (console.log)
			console.log("PropVector2d::propagate bad updateTime");
		//throw new Error("PropVector2d::propagate bad updateTime")
	} else {

	var dt = t - this.updateTime;
	this.x += this.velX*dt
	this.y += this.velY*dt
	this.updateTime = t;
	if (!(this.updateTime != undefined))
		throw new Error("bad updateTime");
	}
}
*/
/*
Prop.PropVector2d.makeFromObj = function(obj) {
	throw new Error("depcrecate");
	var r = new Prop.PropVector2d();
	r.x = obj.x;
	r.y = obj.y;
	r.velX = obj.velX;
	r.velY = obj.velY;
}
*/


Prop.PropVector2d.prototype.setValues = function(x,y) {
	this.x = x; this.y = y;
}
Prop.PropVector2d.prototype.setVelocity = function(vx,vy){
	this.velX = vx; this.velY = vy;
}
Prop.PropVector2d.prototype.setUpdateTime = function(t) {
	this.updateTime = t;
}
Prop.PropVector2d.prototype.stripData = function() {
	this.x = undefined;
	this.y = undefined;
	this.velX = undefined;
	this.velY = undefined;
}

Prop.PropVector2d.prototype.applySpecificData = function(obj) {
	//return Prop.applyData.apply(this, arguments);
	//debugger;
	/*
	if (obj.ut == undefined)
		debugger;
	*/
	if (obj == undefined) return;

	if (obj.x != undefined)
		this.x = obj.x;
	if (obj.y != undefined)
		this.y = obj.y;
	if (obj.vx != undefined)
		this.velX = obj.vx;
	if (obj.vy != undefined)
		this.velY = obj.vy;
	if (obj.ut != undefined)
		this.updateTime = obj.ut;
	return this;
}

Prop.PropVector2d.prototype.getSpecificData = function() {
	var fixed = 1;
	var myround = function(num) {
		if (num == undefined)
			debugger;
		return Math.round(num*1000)/1000;
	}
	return {x:myround(this.x), 
			y:myround(this.y), 
			vx:myround(this.velX), 
			vy:myround(this.velY), 
			ut:this.updateTime};
	//return this;
}
Prop.PropVector2d.prototype.propagate = function(t) {
	if (this.updateTime == undefined){
		if (console.log)
			console.log("PropVector2d::propagate bad updateTime");
		//throw new Error("PropVector2d::propagate bad updateTime")
	} else {

	var dt = t - this.updateTime;
	this.x += this.velX*dt
	this.y += this.velY*dt
	this.updateTime = t;
	if (!(this.updateTime != undefined))
		throw new Error("bad updateTime");
	}
}
Prop.PropVector2d.prototype.getVelocityNorm = function() {
	return Math.sqrt((this.velX*this.velX + this.velY*this.velY));
}
/*
Prop.PropVector2d.makeFromObj = function(obj) {
	throw new Error("depcrecate");
	var r = new Prop.PropVector2d();
	r.x = obj.x;
	r.y = obj.y;
	r.velX = obj.velX;
	r.velY = obj.velY;
}
*/


//-----
Prop.PropCylindrical = function(sd) {
		this.r = 0.0;
		this.theta = 0.0;

		this.velR = 0.0;
		this.velTheta = 0.0;

		Prop.PropVector2d.call(this,sd);


}
Prop.PropCylindrical.prototype = Object.create(Prop.PropVector2d.prototype);
Prop.PropCylindrical.prototype.constructor = Prop.PropCylindrical;
Prop.PropCylindrical.prototype.setCylValues = function(r,th) {
	this.r = r;
	this.th = th;
}
Prop.PropCylindrical.prototype.setCylVelocity = function(vr, vth) {
	this.velR = vr;
	this.velTheta = vth;
}
Prop.PropCylindrical.prototype.propagate = function(ut) {
	var costheta = Math.cos(this.theta);
	var sintheta = Math.sin(this.theta);
	this.x = this.r*costheta;
	this.y = this.r*sintheta;

	this.velX = this.velR*costheta - this.velTheta * sintheta;
	this.velY = this.velR*sintheta + this.velTheta * costheta;

	return Prop.PropVector2d.prototype.update.apply(this,arguments);
}


Prop.PropScalar = function() {
	this.scalarValue = 0.0;
	this.velocity = 0.0;
	this.updateTime = undefined;
}
Prop.PropScalar.prototype.applySpecificData = function(obj) {
	if (obj.s)
		this.scalarValue = obj.s;
	if (obj.v)
		this.velocity = obj.v;
	if (obj.ut)
		this.updateTime = obj.ut;

	return this;
}
Prop.PropScalar.prototype.propagate = function(t) {
	if (this.updateTime == undefined)
		throw new Error("PropScalar::propagate bad updateTime");
	this.scalarValue += this.velocity * (t-this.updateTime);
	this.updateTime = t;
}
Prop.PropScalar.prototype.getSpecificData = function() {
	return {s:this.scalarValue, v:this.velocity, ut:this.updateTime};
}
//-----
Prop.PropCircleMover = function(sd) {
	this.position = new Prop.PropVector2d(); //only going to use velocity.x
	this.angle = new Prop.PropScalar();
	this.updateTime = undefined;
	this.circle = undefined;

	this.applySpecificData(sd);


	//this.angleVelocityCutoff = 0.0000001;
}
Prop.PropCircleMover.prototype.getVelocityUnit = function() {
	var ret = {};
	var norm = this.position.getVelocityNorm();

	var normZeroCutoff = 0.00000001;
	var x, y;
	if (norm > normZeroCutoff) {
		x = this.position.velX;
	} else {
		x = 1.0;
		norm = 1.0;
	}
	y = 0;

	var a = this.angle.scalarValue;
	var c = Math.cos(a);
	var s = Math.sin(a);

	ret.x = c*x - s*y; ret.x /= norm;
	ret.y = s*x + c*y; ret.y /= norm;
	

	return ret;
}
Prop.PropCircleMover.prototype.setBoostManager = function(bm) {
	this.boostManager = bm;
	return this;
}
Prop.PropCircleMover.angleVelocityCutoff = 0.0000001
Prop.PropCircleMover.prototype.setUpdateTime = function(gt) {
	throw new Error("deprecated");
	this.position.updateTime = gt;
	this.angle.updateTime = gt;
	this.updateTime = gt;
}
Prop.PropCircleMover.prototype.boostVelocity = function(boost, gt) {
	this.propagate(gt);
	this.position.velX += boost;
	this.position.updateTime = gt;
	this.updateTime = gt;
	this.boostManager(this.position, this.angle);
	this.makeCircle();
}
Prop.PropCircleMover.prototype.boostAngle = function(boost, gt) {
	this.propagate(gt);
	this.angle.velocity += boost;
	this.angle.updateTime = gt;
	this.updateTime = gt;
	this.boostManager(this.position, this.angle);
	this.makeCircle();
}
Prop.PropCircleMover.prototype.getSpecificData = function() {
	if (this.updateTime == undefined)
		throw new Error("getSpecificData, bad updateTime");
	return {
		p:this.position.getSpecificData()
		,a:this.angle.getSpecificData()
		,ut:this.updateTime
	}
}
Prop.PropCircleMover.prototype.applySpecificData = function(obj) {
	if (obj == undefined)
		return;
	if (obj.p)
		this.position.applySpecificData(obj.p);
	if (obj.a)
		this.angle.applySpecificData(obj.a);
	if (obj.ut)
		this.updateTime = obj.ut;
	/*
	//debugger;

	var pApplied = this.position.applyData(obj.position);
	var aApplied = this.angle.applyData(obj.angle);
	if (obj.updateTime != undefined)
		this.updateTime = obj.updateTime;
	/*
	if (pApplied || aApplied) {
		this.updateTime = updateTime;
		return true;
	}
	* /
	*/
	//return false;
	return this;
}
Prop.PropCircleMover.prototype.stripData = function() {
	this.position = undefined;
	this.angle = undefined;
	this.updateTime = undefined;
	this.circle = undefined;
}
Prop.PropCircleMover.prototype.makeCircle = function() {
	if (this.updateTime == undefined) {
		throw new Error("PropCircleMover::makeCircle bad updateTime");
	}
	var circle = {};
	//debugger;
	if (Math.abs(this.angle.velocity) > Prop.PropCircleMover.angleVelocityCutoff) {
	var completionTime = 1.0/this.angle.velocity;//in units where 2Pi = 1
	var circumference = completionTime * this.position.velX;
	circle.radius = circumference; //2PI = 1, sign of radius is for rhanded or lhanded circles (pos is lhanded)
	//debugger;
	if (circle.radius > 0) 
		circle.currentCircleAngle = this.angle.scalarValue - Math.PI/2; 
	else 
		circle.currentCircleAngle = this.angle.scalarValue + Math.PI/2;

	circle.startTime = this.updateTime;
	circle.origin = {};
	circle.origin.x = this.position.x - Math.abs(circle.radius)*Math.cos(circle.currentCircleAngle);
	circle.origin.y = this.position.y - Math.abs(circle.radius)*Math.sin(circle.currentCircleAngle);
	if (isNaN(circle.origin.y) || isNaN(circle.origin.x))

		throw new Error("PropCircleMover::makeCircle NaN");
	//console.log("circle: ",JSON.stringify(circle));
	//debugger;
	this.circle = circle;

	}
	//using the convention that the object pointed straight up is angle 0,
	//because the stupid graphics library does it that way.
	//currentCircleAngle is the standard polar angle



}
Prop.PropCircleMover.prototype.propagate = function(t) {

	//var dt = t - this.updateTime;
	//if (this.mrp == undefined)
	this.angle.propagate(t);
	//var speed = this.position.velX;
	var curAngle = this.angle.scalarValue; //remember the object angle convention
	if (Math.abs(this.angle.velocity) > Prop.PropCircleMover.angleVelocityCutoff) {

	
	if (this.circle == undefined) {
		this.makeCircle();
	}
	var circle = this.circle;
	var circleAngle;
	if (circle.radius > 0) circleAngle = this.angle.scalarValue - Math.PI/2;
	else circleAngle = this.angle.scalarValue + Math.PI/2
	this.position.x = this.circle.origin.x + Math.abs(circle.radius)*Math.cos(circleAngle); //add PI/2 to convert to angle around the circle
	this.position.y = this.circle.origin.y + Math.abs(circle.radius)*Math.sin(circleAngle);
	if (this.position.x < 0) debugger;
	} else {
		//debugger;
		this.circle = undefined;
		if (this.mrp == undefined) this.mrp = this.position.updateTime;
		var dt = t - this.mrp;
		var speed = this.position.velX;
		this.position.x += speed*dt*Math.cos(curAngle);
		this.position.y += speed*dt*Math.sin(curAngle); 
		this.position.updateTime = t;
		this.updateTime = t;
	}
	if (isNaN(this.position.y) || isNaN(this.position.x)) 
		throw new Error("PropCircleMover::propagate NaN");
	//this.updateTime = t;
	//this.position.updateTime = t;
	this.mrp = t;
}



if (!this.___alexnorequire) {
	exports.Prop = Prop;
}
