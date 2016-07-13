function Destination() {
	this.destinationKind = undefined;
	this.destinationDataCode = undefined;

	this.destinationData = undefined;
}	
Destination.SEND = "SD"
Destination.SKIP = "SK"

Destination.ALL = "AL";
Destination.ME = "ME";
Destination.MYTEAM = "MT";
Destination.CUSTOM = "CM";

Destination.prototype.toJSON = function() {
	return {
		dk:this.destinationKind
		,dc:this.destinationDataCode
		,dd:this.destinationData
	};
}
Destination.makeFromObj = function(obj) {
	var ret = new Destination();
	ret.destinationKind = obj.dk;
	ret.destinationDataCode = obj.dc;
	ret.destinationData = obj.dd;
	return ret;
}
Destination.prototype.checkSameLoc = function(myLoc, recipLoc) {
	//recipLoc is always the right length;
	var lengthDif = myLoc.length - recipLoc.length
	if (lengthDif < 0) throw new Error("bad myLoc");
	var myLocComparable = myLoc.slice(lengthDif + 1); //+1 to get rid of leading bracket
	var recipLocComparable = recipLoc.slice(1); 
	return (myLocComparable == recipLocComparable);
}
Destination.prototype.checkIfSend = function(myLoc, recipLoc, myTeam, recipTeam) {
	//locs are treeLoc strings
	//teams are teamname strings
	var sameLoc = this.checkSameLoc(myLoc, recipLoc);
	var ret = true; //default is send, default is Destination.SEND
	if (this.destinationDataCode == Destination.ME) {
		if (sameLoc) ret = true;
		else ret = false;
	} else if (this.destinationDataCode == Destination.MYTEAM) {
		if (myTeam == recipTeam) ret = true;
		else ret = false;
	} else if (this.destinationDataCode == Destination.ALL) {
		ret = true;
	} else throw new Error("bad destinationDataCode");
	
	if (this.destinationKind == Destination.SEND)
	  return ret;
	else if (this.destinationKind == Destination.SKIP)
	  return !ret;
	else throw new Error("bad destinationKind");
}
Destination.notMe = function() {
	var ret = new Destination();
	ret.destinationKind = Destination.SKIP;
	ret.destinationDataCode = Destination.ME;
	return ret;
}

if (!this.___alexnorequire) {
	exports.Destination = Destination;
}