if (!this.___alexnorequire) {
	var Frag = require("./Frag").Frag;
	var util = require("util");
}
function DifferenceObj() {
	this.fraglist = [];
	this.timestamp = undefined;

	//this.fragMaker = fragMaker;
}

DifferenceObj.prototype.appendDifObj = function(difo) {
	//throw new Error("not ready?")
	for (var i=0; i < difo.fraglist.length; i++) {
		var frag = difo.fraglist[i];
		//frag.updateTime = difo.timestamp;
		this.add(frag);
	}
}
DifferenceObj.prototype.add = function(frag) {
	this.fraglist.push(frag);
	return this;
}
DifferenceObj.prototype.clear = function() {
	while(this.fraglist.length > 0)this.fraglist.pop();
}
DifferenceObj.prototype.toJSON = function() {
	return {fl:this.fraglist};
	//return {fl:this.fraglist,
	//	,ti:this.timestamp};
}
DifferenceObj.prototype.clone = function() {
	return DifferenceObj.makeFromObj(JSON.parse(JSON.stringify(this)));
}
DifferenceObj.prototype.sendTo = function(sendable,replacer) {
	sendable.send(JSON.stringify(this,replacer));
}
DifferenceObj.prototype.processFrags = function(callback) {
	for (var i=0; i < this.fraglist.length; i++) {
		callback(this.fraglist[i]);
	}
}
DifferenceObj.makeFromObj = function(obj) {
	//util.log(JSON.stringify(obj));
	var ret = new DifferenceObj();
	for (var i=0,l=obj.fl.length;i<l;i++) {
		ret.fraglist.push(Frag.makeFromObj(obj.fl[i]));
	}
	/*
	if (obj.initp !== undefined)
		ret.initp = obj.initp;
	ret.timestamp = obj.ti;
	*/
	return ret;
}

if (!this.___alexnorequire)
exports.DifferenceObj = DifferenceObj;