function AlexUtil() {


}
 AlexUtil.getNextAvailable = function(array) {
	var i=0;
	while (i < array.length) {
		if (array[i] == undefined)
			return i
		i++;
	}
	return array.length;
	//var ret = array.length;
	//array.push()
	//throw new Error("getNextAvailable failed: "+i);
}
function BasicIdManager() {
	this.idList = [];
}
BasicIdManager.prototype.requestId = function() {
    var id = AlexUtil.getNextAvailable(this.idList);
    this.idList[id] = true;
    return id;
}
BasicIdManager.prototype.releaseId = function(id) {
	if (this.idList[id] == undefined) throw new Error("badId");
	this.idList[id] = undefined;
}
if (!this.___alexnorequire) {
	exports.AlexUtil = AlexUtil;
	exports.BasicIdManager = BasicIdManager;
}