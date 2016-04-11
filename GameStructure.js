if (!this.___alexnorequire) {
	var Callbacks = require("./Callbacks").Callbacks;
	var GameServer = require("./GameServer").GameServer;
	var ServerHandlerLink = require("./ServerHandlerLink").ServerHandlerLink;
	var HandlerBridgeServerSide = require("./HandlerBridge").HandlerBridgeServerSide;
	var GameHandler = require("./GameHandler").GameHandler;
	var util = require("util");
} else {
	util = console;
}

function GameStructure(obj, instructions) { //instructions element is {n:name, d:default}

	this.callbacks = new Callbacks();
	//util.log(JSON.stringify(instructions));
	for (var i of instructions){
		var name = i.n;
		var Def = i.d;
		if (obj[name]) {
			util.log("giving gameStruture the custom: "+name);
			this[name] = obj[name];
		} else {
			util.log("giving gameStruture the default: "+name);
			this[name] = new Def();
		}
	}

	for (var index in instructions) {
		if (instructions.hasOwnProperty(index)) {
			util.log("index: "+index+" value: "+JSON.stringify(instructions[index]));
		var previ = instructions[parseInt(index)-1];
		var prev = previ ? previ.n : undefined;
		var nexti = instructions[parseInt(index)+1];
		var next = nexti ? nexti.n : undefined;

		var n = instructions[index].n;
		if (prev) {
			//util.log("giving gameStructure["+n+"] the property: "+previ.n);
			this[n][previ.n] = this[previ.n];
		}
		if (next) {
			//util.log("giving gameStructure["+n+"] the property: "+nexti.n);
			this[n][nexti.n] = this[nexti.n]; //should definitely double check this
		}
		this[n].gameStructure = this;

		if (this[n].gameStructureHasInitialized != undefined)
			this[n].gameStructureHasInitialized();
		//this[n].registerStructure(prev,next,this);
		}
	}
}
GameStructure.prototype.trigger = function() { //pass directly to callbacks
	return this.callbacks.trigger.apply(this.callbacks, arguments);
}
GameStructure.prototype.register = function() {
	return this.callbacks.register.apply(this.callbacks, arguments);
}


function InitializeClientStructure(obj, instructions) {
	obj = obj || {};
	if (instructions == undefined) {
		instructions = [{n:"clientSocket", d:ClientSocket},
		{n:"handlerBridge", d:HandlerBridgeClientSide},
		{n:"gameHandler", d:GameHandler},
		{n:"client", d:undefined}
		];
	}
	return new GameStructure(obj, instructions)
}
function InitializeServerStructure(obj, instructions) {
	obj = obj || {};
	if (instructions == undefined) {
		instructions = [{n:"gameServer", d:GameServer},
			{n:"serverHandlerLink", d:ServerHandlerLink},
			{n:"handlerBridge", d:HandlerBridgeServerSide},
			{n:"gameHandler", d:GameHandler}
		];
	}

	return new GameStructure(obj, instructions);
}
if (!this.___alexnorequire) {
	exports.InitializeServerStructure = InitializeServerStructure;
}
