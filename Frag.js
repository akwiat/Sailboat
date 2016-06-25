if (!this.___alexnorequire) {
var MakeTreeNode = require("./Tree").MakeTreeNode;
}
function FragDestination() {
	this.destinationKind = undefined;
	this.destinationDataCode = undefined;

	this.destinationData = undefined;
}	
FragDestination.SEND = "SD"
FragDestination.SKIP = "SK"

FragDestination.ALL = "AL";
FragDestination.ME = "ME";
FragDestination.MYTEAM = "MT";
FragDestination.CUSTOM = "CM";

FragDestination.prototype.toJSON = function() {
	return {
		dk:this.destinationKind
		,dc:this.destinationDataCode
		,dd:this.destinationData
	};
}
FragDestination.makeFromObj = function(obj) {
	var ret = new FragDestination();
	ret.destinationKind = obj.dk;
	ret.destinationDataCode = obj.dc;
	ret.destinationData = obj.dd;
	return ret;
}
FragDestination.prototype.checkIfSend = function(myLoc, recipLoc, myTeam, recipTeam) {
	//locs are treeLoc strings
	//teams are teamname strings
	var ret = true; //default is send, default is FragDestination.SEND
	if (this.destinationDataCode == FragDestination.ME) {
		if (myLoc == recipLoc) ret = true;
		else ret = false;
	} else if (this.destinationDataCode == FragDestination.MYTEAM) {
		if (myTeam == recipTeam) ret = true;
		else ret = false;
	} else if (this.destinationDataCode == FragDestination.ALL) {
		ret = true;
	} else throw new Error("bad destinationDataCode");
	
	if (this.destinationKind == FragDestination.SEND)
	  return ret;
	else if (this.destinationKind == FragDestination.SKIP)
	  return !ret;
	else if throw new Error("bad destinationKind");
}
FragDestination.notMe = function() {
	var ret = new FragDestination();
	ret.destinationKind = FragDestination.SKIP;
	ret.destinationDataCode = FragDestination.ME;
	return ret;
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

	this.isSpecificFrag = undefined;
	this.destination = undefined;
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
  //ret.clientProperty = obj.cp;
  /*
  if (obj.tl != undefined) {
  	ret.specificData = Frag.makeFromObj(obj.sd);
  }
  */
  if (obj.sf) ret.isSpecificFrag = true;
  if (obj.dd) ret.destination = FragDestination.makeFromObj(obj.dd);
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
			//cp:this.clientProperty,
			sf:this.isSpecificFrag,
			dd:this.destination
			/*,ms:this.message*/}
}


if (!this.___alexnorequire) {
	exports.Frag = Frag;
}
