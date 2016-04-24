if (!this.___alexnorequire) {
var MakeTreeNode = require("./Tree").MakeTreeNode;
var Frag = require("./Frag").Frag;
}

function GameStateEntity(identifier, obj) {
	this.identifier = identifier;
	this.arrayType = undefined;
	MakeTreeNode(this);
	if (obj) {
		this.wrappedObj = obj;
		this.objType = obj.constructor;
		//this.addComponent(obj);
	}
	this.graphicsObj = undefined;
	this.clientProperty = undefined;
	
}
GameStateEntity.prototype.getIdentifier = function() {
	return this.identifier;
}
GameStateEntity.prototype.setClientProperty = function() {
	this.clientProperty = true;
	return this;
}
GameStateEntity.prototype.setGraphicsObj = function(obj) {
	this.graphicsObj = obj;
}
GameStateEntity.prototype.addComponent = function(obj) {
	//var n = new GameStateEntity(name, obj);
	this.addChild(obj);
	return this;
}
GameStateEntity.prototype.getArrayChildIdentifier = function(parentId, index) {
	return parentId.replace(/Array/,"") + index;

}
GameStateEntity.prototype.getChildByIdentifier = function(id) {
	for (var o of this.children) {
		if (o) {
			if (o.identifier == id)
				return o
			else {
				var ch =  o.getChildByIdentifier(id);
				if (ch !== undefined) return ch;
			}
		}

	}
	return undefined;
	/*
	for (var o of this.children) {
		if (o && o.identifier === id)
			return o;
	}
	if (!recurse)
		return undefined;
	else {
		for (var o of this.children) {
			if (o) {
				var res = o.getChildByIdentifier(id, recurse);
				if (res) return res;
			}
		}
		return undefined;
	}
	*/
}
GameStateEntity.prototype.countChildren = function() {
	var ret = 0;
	for (var i=0; i < this.children.length; i++) {
		if (this.children[i] !== undefined) ret++;
	}
	return ret;
}
GameStateEntity.prototype.addComponentArray = function(Type, num) {
	this.arrayType = Type;
	for (var i=0; i < num; i++) {
		//var n = new GameStateEntity(name+i, new Type());
		var n = new Type();
		this.addChild(n);
		//n.identifier = n.identifier + n.getIndex();
		//n.identifier = this.getArrayChildIdentifier(this.)
	}
	return this;
}
GameStateEntity.prototype.pushObjToArray = function(obj) {
	//var n = new GameStateEntity(undefined, obj);
	this.addChild(obj);
	//obj.identifier = obj.identifier + obj.getIndex();
	//n.identifier = this.identifier + this.getIndex(n);
	return this;
}
GameStateEntity.prototype.addObjToArrayNextAvailable = function(obj, initData) {
	obj = obj || new this.arrayType(initData);
	var l = this.children.length+1;
	for (var i=0; i < l; ++i) {
		if(this.children[i] === undefined){
			this.addChildAtIndex(obj, i);
			//this.children[i] = obj;
			//obj.identifier = obj.identifier + i;
			break;
		}
	}
	return obj;
}
GameStateEntity.prototype.addToArrayWithIndex = function(obj, index) {
	//var n = new GameStateEntity(undefined, obj);
	this.addChildAtIndex(obj, index);
	//obj.identifier = this.identifier + index;
	return obj;
}
GameStateEntity.prototype.searchForIdentifier = function(identifier) {
	if (this.identifier === identifier)
		return this;
	else {
		for (var o of this.children) {
			if (o.searchForIdentifier) {
				var r = o.searchForIdentifier(identifier);
				if (r != undefined)
					return r;
			}
		}
		return undefined;
	}
}
/*
GameStateEntity.prototype.getSpecificData = function() {
	return undefined;
}
*/
GameStateEntity.prototype.applySpecificData = function(sd) {
	if (!this.wrappedObj)
		throw new Error("applySpecificData: bad wrappedObj");
	this.wrappedObj.applySpecificData(sd);
}
GameStateEntity.prototype.getSpecificFrag = function() {
	if (this.isRoot())
		throw new Error("shouldn't be root");
	var retFrag = new Frag();
	retFrag.treeLocation = this.parent.getPath();
	var childFrag = new Frag();
	childFrag.addChildAtIndex(this.getFrag(), this.getIndex());
	retFrag.specificData = childFrag;
	return retFrag;
}
/*
GameStateEntity.prototype.getSpecificFrag = function() {
	if (!this.wrappedObj)
		throw new Error("getSpecificFrag: bad wrappedObj");
	return new Frag(this.wrappedObj.getSpecificData);
	//return new Frag(this.children[0].getFrag(), this.getPath());
}
*/
GameStateEntity.prototype.getFrag = function(frag) {
	var retFrag = frag || new Frag();
	for (var o of this.children) {
		if (o)
			retFrag.addChild(o.getFrag());
	}
	if (this.wrappedObj) {
		retFrag.specificData = this.wrappedObj.getSpecificData();
	}
	retFrag.identifier = this.identifier;
	if (this.clientProperty) {
		//retFrag.clientProperty = this.getPlayerIndex();
		retFrag.clientProperty = this.getPath();
	}
	return retFrag;
	/*
	var sd = {};
		for (var i of this.children) {
			if (this.comps.hasOwnProperty(i)) {
				sd[i] = this.children[i].getFrag();
			}
		}
	return new Frag(sd, this.identifier);
	*/
}
GameStateEntity.prototype.getParentObjWithIdentifier = function(str) {
	if (this.identifier == str)
		return this;
	else if (this.isRoot())
		return undefined;
	else
		return this.parent.getParentObjWithIdentifier(str)
}
GameStateEntity.prototype.getPlayerIndex = function() {
	var player = this.getParentObjWithIdentifier("player");
	if (!player)
		throw new Error("no player found")
	return player.getIndex();
}
GameStateEntity.prototype.getRemovalFrag = function() {
	if (this.isRoot())
		throw new Error("shouldn't be root");
	var f = new Frag();
	f.treeLocation = this.parent.getPath();
	var sd = new Frag();
	var childFrag = new Frag();
	childFrag.shouldRemove = true;
	if (this.clientProperty) {
		childFrag.clientProperty = this.getPath();
	}
	//childFrag.
	sd.addChildAtIndex(childFrag, this.getIndex());
	f.specificData = sd;
	return f;
}
/*
GameStateEntity.prototype.processNew = function(frag, callbacks) {
	var nObj = new this.arrayType();
	var nEnt = this.addToArrayWithIndex(nObj, frag.getIndex());
	nEnt.applyFrag(frag, callbacks);
	callbacks.trigger(nEnt, "new", nEnt.identifier);
	//this.sendTrigger(nEnt, "new", callbacks);
}
GameStateEntity.prototype.processChange = function(frag, callbacks) {
	//this.applyFrag(frag, callbacks);
	this.sendTrigger(obj, "changed", callbacks);
}
GameStateEntity.prototype.processRemove = function(frag, callbacks) {
	var old = obj;
	this.children[frag.identifier] = undefined;	
	this.sendTrigger(old, "removed", callbacks);
}
*/
GameStateEntity.prototype.propagateNew = function(callbacks) {
	for (var o of this.children) {
		if (o)
			o.propagateNew(callbacks);
		//callbacks.trigger(o, )
	}
	/*
	if (this.wrappedObj) {
		callbacks.trigger(this.wrappedObj, "new", this.identifier);
	}
	*/
	callbacks.trigger(this, "new", this.identifier);
}
GameStateEntity.prototype.propagateRemove = function(callbacks) {
	for (var o of this.children) {
		if (o)
			o.propagateRemove(callbacks);
	}
	callbacks.trigger(this, "removed", this.identifier);
}

GameStateEntity.prototype.applyFrag = function(frag, callbacks) {
	var obj;
	if (this.wrappedObj) {
		this.wrappedObj.applySpecificData(frag.specificData);
		//callbacks.trigger(this.)
	}
	if (frag.treeLocation && frag.treeLocation.length != undefined) {//if identifier is an array
		//if (!this.isRoot()) throw new Error("should be root");
		if (frag.treeLocation.length == 0)
			throw new Error("identifier length is 0");
		//var tl = frag.treeLocation.slice(); //shallow copy
		//var chIndex = tl.pop();
		obj = this.getObjFromPath(frag.treeLocation);
		if (!obj) throw new Error("bad obj");
		//frag.treeLocation = undefined;
		//debugger;
		obj.applyFrag(frag.specificData, callbacks);
		//obj.applyFragLogic(chIndex, frag, callbacks);
		//frag.identifier = frag.identifier[0]; //set to the local index
	} else {
		//this.applyFragLogic(this,frag)
		
		for (var i in frag.children) {
			if (frag.children.hasOwnProperty(i)) {
				//var iObj = this.children[i];
				this.applyFragLogic(i, frag.children[i], callbacks);
			}

		}
		
		//obj = this.children[frag.identifier];
	}

}
GameStateEntity.prototype.applyFragLogic = function(chIndex, frag, callbacks) {
	//--apply Logic
	//console.log("applyFragLogic")
	if (this.children[chIndex] == undefined) { //should add a new one
		//debugger;
		var nObj = new this.arrayType();
		var nEnt = this.addToArrayWithIndex(nObj, chIndex);
		nEnt.propagateNew(callbacks);
		nEnt.applyFrag(frag, callbacks);
		
		//this.sendTrigger(nEnt, "new", callbacks);
		//callbacks.trigger(nEnt, "new", nEnt.identifier);
	} else if (frag.shouldRemove){
		var old = this.children[chIndex];

		this.children[chIndex] = undefined;	
		old.propagateRemove(callbacks);

		//this.sendTrigger(old, "removed", callbacks);
		//callbacks.trigger(old, "removed", obj.identifier);
	} else {
		var chObj = this.children[chIndex];
		chObj.applyFrag(frag, callbacks);
		this.sendTrigger(chObj, "changed", callbacks);
		//callbacks.trigger(obj, "changed", obj.identifier);

	}
	//--end apply Logic
}
GameStateEntity.prototype.sendTrigger = function(obj, msg, callbacks) {
	//var id = obj.identifier;
	//var modId = id.replace(/\d/,"");
	callbacks.trigger(obj, msg, obj.identifier);
}
GameStateEntity.prototype.propagate = function(t, callbacks) {
		if (this.wrappedObj) {
			this.wrappedObj.propagate(t);
		}
		for (var o of this.children) {
			if (o != undefined)
				o.propagate(t);
			/*
			if (this.graphicsObj) {
				this.graphicsObj.update();
			}
			*/
		}
}
GameStateEntity.prototype.findChildWithIdentifier = function(identifier) {
	for (var o of this.children) {
		if (o.identifier === identifier)
			return o;
	}
	return undefined;
}
GameStateEntity.prototype.findDirectChildWithIdentifier = function(identifier) {
	for (var o of this.children) {
		if (o !== undefined && o.identifier === identifier)
			return o;
	}
	return undefined;
}
GameStateEntity.prototype.getWrappedObj = function() {
	return this.wrappedObj;
}
GameStateEntity.prototype.clear = function() {
	for (var o of this.children) {
		if (o.clear)
			o.clear();
	}
}


if (!this.___alexnorequire) {
	exports.GameStateEntity = GameStateEntity;
}