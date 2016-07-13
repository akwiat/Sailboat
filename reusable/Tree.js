function TreeNode() {
	this.children = [];
	this.parent = undefined;
}
TreeNode.prototype.addChild = function(obj) {
	this.children.push(obj);
	obj.parent = this;
	return this;
}
TreeNode.prototype.addChildAtIndex = function(obj, index) {
	this.children[index] = obj;
	obj.parent = this;
	return this;
}
TreeNode.prototype.isRoot = function() {
	return (this.parent == undefined);
}
TreeNode.prototype.getIndex = function() {
	if (this.isRoot())
		return 0;
	else
		return this.parent.children.indexOf(this);
}
TreeNode.prototype.getPath = function(arr) {
	arr = arr || [];
	
	if (this.isRoot()) {
		return arr;
		//return arr.join(";");
	} else {
		arr.push(this.getIndex());
		return this.parent.getPath(arr);
	}
}
TreeNode.prototype.getObjFromExpendablePath = function(path) {
	if (path.length > 0) {
		var index = path.pop();
		if (this.children[index] == undefined) return undefined;
		return this.children[index].getObjFromExpendablePath(path);
	} else {
		return this;
	}
}
TreeNode.prototype.getObjFromPath = function(origPath) {
	/*
	if (!this.isRoot())
		throw new Error("TreeNode:getObjFromPath should be root");
	*/
	var path = origPath.slice();
	return this.getObjFromExpendablePath(path);

}
TreeNode.prototype.childAt = function(index) {
	return this.children[index];
}
TreeNode.compareLocations = function(l1, l2) {
	if (l1.length != l2.length) return false;

	for (var i=0; i < l1.length; i++) {
		if (l1[i] != l2[i]) return false;
	}
	return true;
}
TreeNode.trimToLength = function(array, shortArray) {
	var dif = array.length - shortArray.length;
	if (dif < 0) throw new Error("trim problem");
	return array.slice(array.length-shortArray.length, array.length);
}
function MakeTreeNode(obj) {
	TreeNode.apply(obj);

	var arr = Object.getOwnPropertyNames(TreeNode.prototype);
	for (var o of arr) {
		if (o != "constructor")
			obj.constructor.prototype[o] = TreeNode.prototype[o];
	}
}
if (!this.___alexnorequire) {
	exports.MakeTreeNode = MakeTreeNode;
	exports.TreeNode = TreeNode;
}
/*
function MakeTreeNode(obj) {
	var arr = Object.getOwnPropertyNames(TreeNode);
	for (var o of arr) {
		if (TreeNode.hasOwnProperty(o))
			obj[o] = 
	}
}
*/
