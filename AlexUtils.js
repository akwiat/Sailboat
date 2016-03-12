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
if (!this.___alexnorequire) {
	exports.AlexUtil = AlexUtil;
}