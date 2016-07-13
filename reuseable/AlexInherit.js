function AlexInheritConstructor() { //(this, Parent, parentCtorArguments)


	var th = arguments[0]
	var Parent = arguments[1];


//call the parent constructor with the proper arguments
	var nArray = [];
	for (var i=2; i < arguments.length; i++) {
		nArray.push(arguments[i]);
	}

	Parent.apply(th, nArray);
	


}
function AlexInheritDetails(Child,Parent) {
	Child.prototype = Object.create(Parent.prototype);
	Child.prototype.constructor = Child;
}

if (!this.___alexnorequire) {
	exports.AlexInheritConstructor = AlexInheritConstructor;
	exports.AlexInheritDetails = AlexInheritDetails;
}
