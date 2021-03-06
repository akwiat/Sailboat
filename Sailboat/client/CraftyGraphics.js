function CraftyGraphics(graphicsSettings, onFrameCallback) {
  this.callbacks = new Callbacks();
  this.onFrameCallback = onFrameCallback;
  var graphicsCallbacks = this.callbacks; //see it in the closure
  
  var InternalGameSize = graphicsSettings.InternalGameSize;
  
  this.size = Math.min(window.innerWidth, window.innerHeight);
  this.ratio = this.size/InternalGameSize;
	var GraphicsRatio = this.ratio;
	var GraphicsSize = this.size;
	
	var convertToGameCoord = function(graphicsCoordX, graphicsCoordY) {
		var ret = {};
		ret.x = graphicsCoordX/GraphicsRatio;
		ret.y = (GraphicsSize - graphicsCoordY)/GraphicsRatio;
		return ret;
	}
	var convertToGraphicsCoord = function(gameCoordX, gameCoordY, w, h) {
		var ret = {};
		ret.x = gameCoordX * GraphicsRatio;
		ret.y = (InternalGameSize - gameCoordY) * GraphicsRatio;

		adjustForStupidOrigin(ret, w, h);
		return ret;
	}
	this.convertToGraphicsCoord = convertToGraphicsCoord;
	this.setEntityGraphicsCoords = function(entity, gx, gy) {
		var w = entity.w;
		var h = entity.h;

		var ret = this.convertToGraphicsCoord(gx, gy, w, h);
		entity.x = ret.x;
		entity.y = ret.y;
	}
	var adjustForStupidOrigin = function(obj, w, h) {
		if (!w || !h)debugger;
		obj.x -= w/2;
		obj.y -= h/2;
	}
	var positionAndRotation = function(gameX, gameY, angle, w, h) {
		var ret = convertToGraphicsCoord(gameX, gameY, w, h);
		/*
		if ((vx*vx + vy*vy) > 0.000001) {
					var radRotation = Math.atan2(posObj.velY, posObj.velX);
					radRotation -= Math.PI/2;
					radRotation *= -1;
					ret.rotation = radRotation*180/Math.PI;
				}
		*/
		var radRotation = angle;
		radRotation -= Math.PI/2;
		radRotation *= -1;
		ret.rotation = radRotation*180/Math.PI;

		//ret.x -= w/2;
		//ret.y -= h/2;
		//adjustForStupidOrigin(ret, w, h);

		return ret;
	}
	
	
		Crafty.init(this.size, this.size, document.getElementById('game'));
	Crafty.background('#081848');
	Crafty.c("Box", {
		required: "2D, Canvas, Color"
	});
	//Crafty.addEvent(this, Crafty.stage.elem, "mousemove", onMouseMove);
	Crafty.c("GameStateEntity", {
		required: "2D, Canvas, Color",
		gameStateEntity: function(entity) {
			this.gameStateEntity = entity;
			return this;
		}


	});
	Crafty.c("PropCircleMover", {
		required: "GameStateEntity",
		events: {
			"UpdateFromGameState": function() {
				//debugger;
				if (this.gameStateEntity) {
					var posChild = this.gameStateEntity.findChildWithIdentifier("position");
					var posObj = posChild.getWrappedObj();

					//debugger;
					//console.log(posObj.position.x +", "+posObj.position.y+", "+posObj.angle.scalarValue);
					var attrObj = positionAndRotation(posObj.currentValues.x, posObj.currentValues.y,
					posObj.currentValues.angle, this.w, this.h );
					//console.log(JSON.stringify(attrObj));
					this.attr(attrObj);
				}
			}
		}

	});

	Crafty.c("PropPosition", {
		required: "GameStateEntity",
		events: {
			"UpdateFromGameState": function() {
				//console.log("updatingFromGameState");
				if (this.gameStateEntity) {
				var posChild = this.gameStateEntity.findChildWithIdentifier("position");
				var posObj = posChild.getWrappedObj();
				var x = posObj.currentValues.x;
				var y = posObj.currentValues.y;
				var attrObj = convertToGraphicsCoord(x, y, this.w, this.h);

				if ((posObj.velY*posObj.velY + posObj.velX*posObj.velY) > 0.000001) {
					var radRotation = Math.atan2(posObj.velY, posObj.velX);
					radRotation -= Math.PI/2;
					radRotation *= -1;
					attrObj.rotation = radRotation*180/Math.PI;
				}
				// console.log(JSON.stringify(posObj));
				this.attr(attrObj);

				}
			}
		}
	});
	var destroyEntity = function() {
		this.destroy();
	}
	Crafty.c("AlexEffect", {
		setDuration: function(dur) {
			this.duration = dur;
		}
		,startEffect: function() {
			this.timeoutId = setTimeout(destroyEntity.bind(this), this.duration*1000); //conv to ms
		}
	});
	
		var mobileMotion = function(data) {
		var cap = 30;
		var xVal = data.tiltLR*-1;
		var yVal = data.tiltFB*-1 + 90;
		if (xVal > cap) xVal = cap;
		if (xVal < -cap) xVal = -cap;
		if (yVal > cap) yVal = cap;
		if (yVal < -cap) yVal = -cap;

		lastInput = {x:xVal/(2*cap), y:yVal/(2*cap)};

	}
	if (Crafty.mobile) {
		Crafty.device.deviceMotion(mobileMotion);
	}
	
	
	Crafty.bind("EnterFrame", function(eventData) {

		//graphicsCallbacks.trigger(eventData, "OnFrame");

		this.onFrameCallback(eventData);
		Crafty.trigger("UpdateFromGameState");

	}.bind(this) );
	
	
	
	
}
