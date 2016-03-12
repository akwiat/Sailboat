if (!this.___alexnorequire) {
var MakeTreeNode = require("./Tree").MakeTreeNode;
}	
function Frag(specificData, identifier, updateTime) {
	//this.typeCode = typeCode;
	//this.objIndex = objIndex;
	this.identifier = identifier
	this.updateTime = updateTime;
	this.specificData = specificData;
	//this.message = undefined;
	this.shouldRemove = undefined;
	this.isNew = undefined;

	this.treeLocation = undefined;
	this.clientProperty = undefined;
	MakeTreeNode(this);
}

Frag.makeFromObj = function(obj) {
  var ret = new Frag(obj.sd,obj.id, obj.ut);
  if (obj.sr == true)
  	ret.shouldRemove = true;

  if (obj.ne == true)
  	ret.isNew = true;

  for (var i in obj.ch) { 
  	if (obj.ch.hasOwnProperty(i)) {
  		var o = obj.ch[i];
	  	if (o) {
	  	var chFrag = Frag.makeFromObj(o);
	  	ret.addChildAtIndex(chFrag, i);
	  	}
  	}
  }
  ret.treeLocation = obj.tl;
  ret.clientProperty = obj.cp;
  if (obj.tl != undefined) {
  	ret.specificData = Frag.makeFromObj(obj.sd);
  }
  return ret;
}
Frag.makeFromStr = function(str) {
	var obj = JSON.parse(str);
	return Frag.makeFromObj(obj);
}
Frag.removalFrag = function(identifier) {
	var f = new Frag(undefined, identifier, undefined);
	f.shouldRemove = true;
	return f;
}
Frag.prototype.setIsNew = function() {
	this.isNew = true;
	return this;
}
Frag.prototype.toJSON = function() {
	/*
	if (this.clientProperty && this.clientProperty == clientIndex) //how do I get clientIndex in here?
		return undefined;
	else
		*/
		return {
			ut:this.updateTime,
			sd:this.specificData,
			sr:this.shouldRemove,
			ne:this.isNew,
			ch:this.children,
			tl:this.treeLocation,
			cp:this.clientProperty
			/*,ms:this.message*/}
}


if (!this.___alexnorequire) {
	exports.Frag = Frag;
}
