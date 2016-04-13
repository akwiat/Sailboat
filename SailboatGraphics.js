function SailboatGraphics() {
	this.callbacks = new Callbacks();
	var graphicsCallbacks = this.callbacks; //for closure purposes
	
	var InternalGameSize = 1000;
	var ShipWidth = 25;
	var ShipAspect = 2;
	var ShipFrontAspect = .5;

	var BulletWidth = 20;
	var BulletAspect = 1;
	this.size = Math.min(window.innerWidth, window.innerHeight);
	this.ratio = this.size/InternalGameSize;
	var GraphicsRatio = this.ratio;
	var GraphicsSize = this.size;

	var PlayersSupported = 2;
	var convertToGameCoord = function(graphicsCoordX, graphicsCoordY) {
		var ret = {};
		ret.x = graphicsCoordX/GraphicsRatio;
		ret.y = (GraphicsSize - graphicsCoordY)/GraphicsRatio;
		return ret;
	}
	var convertToGraphicsCoord = function(gameCoordX, gameCoordY) {
		var ret = {};
		ret.x = gameCoordX * GraphicsRatio;
		ret.y = (InternalGameSize - gameCoordY) * GraphicsRatio;
		return ret;
	}

	var positionAndRotation = function(gameX, gameY, angle, w, h) {
		var ret = convertToGraphicsCoord(gameX, gameY);
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

		ret.x -= w/2;
		ret.y -= h/2;

		return ret;
	}
	//var lastInput = {};
	/*
	var onMouseMove = function(e) {
		/*
		if (Crafty.mobile)
			return {x:0, y:-.03};
		* /
		//var mouseX = e.realX;
		//var mouseY = e.realY;
		var obj = Crafty.domHelper.translate(e.clientX, e.clientY);
		var mouseX = obj.x;
		var mouseY = obj.y;
		var scaledX = mouseX/GraphicsSize;
		var scaledY = 1 - (mouseY/GraphicsSize);
		var shiftedX = scaledX - 0.5;
		var shiftedY = scaledY - 0.5;
		lastInput = {x:shiftedX, y:shiftedY};
		//console.log(JSON.stringify(lastInput));
		//debugger;
	}
	*/
	/*
	var getInputData = function() {
		if (!Crafty.lastEvent)
			return undefined;

	}
	*/
	//var stageElem
	Crafty.init(this.size, this.size, document.getElementById('game'));
	Crafty.background('#DFDFDF');
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
					var attrObj = positionAndRotation(posObj.position.x, posObj.position.y,
					posObj.angle.scalarValue, this.w, this.h );
					console.log(JSON.stringify(attrObj));
					this.attr(attrObj);
				}
			}
		}

	});
	/*
	Crafty.c("PropPosition", {
		required: "GameStateEntity",
		events: {
			"UpdateFromGameState": function() {
				//console.log("updatingFromGameState");
				if (this.gameStateEntity) {
				var posChild = this.gameStateEntity.findChildWithIdentifier("position");
				var posObj = posChild.getWrappedObj();
				var attrObj = convertToGraphicsCoord(posObj.x, posObj.y);

				if ((posObj.velY*posObj.velY + posObj.velX*posObj.velY) > 0.000001) {
					var radRotation = Math.atan2(posObj.velY, posObj.velX);
					radRotation -= Math.PI/2;
					radRotation *= -1;
					attrObj.rotation = radRotation*180/Math.PI;
				}
				//console.log(JSON.stringify(posObj));
				this.attr(attrObj);

				}
			}
		}
	});
	*/
	Crafty.c("SAShip", {
		required: "PropCircleMover"
		,init: function() {
			this.w = ShipWidth*GraphicsRatio;
			this.h = this.w*ShipAspect;
			//this.origin(this.w/2, this.h/2);
			this.origin("center");

			//this.x = this.w; this.y = this.h;
			this.rotation = 0;
			this.color("black");
		}
		/*
		,events: {
			"EnterFrame":function() {
				this.rotation += .5;
			}
		}
		*/
	});
	Crafty.c("HAShip", {
		required: "PropPosition, Collision, WiredHitBox",
		init: function() {
			//console.log("HAShip init");
			this.w = ShipWidth*GraphicsRatio;
			this.h = this.w*ShipAspect;
			//this.attr({x:-50})
			/*
			this.x = -100;
			this.y = -100;
			*/
			this.origin("center");
			this.color('blue');
			this.checkHits("HAShipFront");
			this.bind("HitOn", function(hitData) {
				//console.log("hit on");
				for (var o of hitData) {
					/*
					var test1 = o.obj.gameStateEntity.getIndex();
					var test2 = this.gameStateEntity.getIndex();
					if (test1 != test2)
						console.log("bad collision");
					*/
					//debugger;
				var thisPlayerIndex = this.gameStateEntity.getPlayerIndex();
				if (thisPlayerIndex
					!= o.obj.gameStateEntity.getPlayerIndex()) {
					if (this.x > 0) {
						if (thisPlayerIndex == gameStructure["gameHandler"].myPlayer.getPlayerIndex())
						SailboatRunClient.onDeadShip.call(gameStructure, this.gameStateEntity);
					}
					//debugger;
				/*
					if (this.x > 0)
						console.log("collision");
					*/

				}
					//debugger;
					
				}
					this.resetHitChecks("HAShipFront");
				
			});
			/*
			this.bind("KeyDown", function(e) {
				if (e.key == Crafty.keys.SPACE) {
					if (this.gameStateEntity.getPlayerIndex() == 
						gameStructure["gameHandler"].myPlayer.getPlayerIndex())
					SailboatRunClient.onBulletShoot.call(gameStructure, this.gameStateEntity);
				}
			});
			*/
			//console.log(this);
			//debugger;
		}
	});
	Crafty.c("HAShipFront", {
		required: "2D, Canvas, Color, Collision, WiredHitBox",
		init: function() {
			debugger;
			this.w = ShipWidth*GraphicsRatio;
			this.h = this.w*ShipFrontAspect;
			this.origin("center");
			this.x = 0;
			this.y = 0;
		}
	});
	Crafty.c("HABullet", {
		required: "PropPosition, Collision",
		init: function() {
			debugger;
			this.w = BulletWidth*GraphicsRatio;
			this.h = this.w*BulletAspect;
			this.origin("center");
			this.color("black");
			this.checkHits("HAShip");
			this.bind("HitOn", function(hitData) {
				for (var o of hitData) {
					if (!o) continue;
					if (!(o.obj.x > 0) )continue;
					//console.log("hit");
					var thisPlayerIndex = o.obj.gameStateEntity.getPlayerIndex();

					
						if (thisPlayerIndex == gameStructure["gameHandler"].myPlayer.getPlayerIndex())
						SailboatRunClient.onDeadShip.call(gameStructure, o.obj.gameStateEntity);
					

				}
				this.resetHitChecks("HAShip");
			});
		}
	});
	Crafty.bind("EnterFrame", function(eventData) {
		/*
		var inputData = getInputData();
		if (inputData)
			SailboatRunClient.onInput.call(this, inputData);
		*/
		//SailboatRunClient.onInput.call(this, lastInput);
		
		
		//SailboatRunClient.onFrame.call(this, eventData);
		graphicsCallbacks.trigger(eventData, "OnFrame");
		//graphicsCallbacks.trigger(eventData, "OnInput");
		Crafty.trigger("UpdateFromGameState");
	/*
		var myP = this["gameHandler"].myPlayer;
		if (myP) {
		var shipArray = myP.children[0];
		for (var o of shipArray.children) {
			if (o) {
				if (!o.graphicsObj.within(0,0,GraphicsSize*.95,GraphicsSize*.95)) {
					//console.log("stopping");
					var pos = o.children[0].wrappedObj;
					var x = undefined;
					var y = undefined;
					if (pos.x < 0)
						x = 0;
					if (pos.x > InternalGameSize)
						x = InternalGameSize;
					if (pos.y < 0)
						y = 0
					if (pos.y > InternalGameSize)
						y = InternalGameSize;
					var dataObj = {vx:0, vy:0};
					if (x != undefined)
						dataObj.x = x;
					if (y != undefined)
						dataObj.y = y;
					pos.applySpecificData(dataObj);
					//debugger;
				} else {
					/*
					for (var i=GraphicsSize; i > 0; --i) {
						if (!o.graphicsObj.within(0,0,i,i))
							debugger;
					}
					debugger;
					* /
				}
			}
		}
		}
	*/
	} );
//	}.bind(gameStructure));

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
      //Crafty.e('2D, DOM, Color').attr({x: 0, y: 0, w: 100, h: 200}).color('#F00');
}
SailboatGraphics.prototype.getNewShipObj = function(gameStateEntity) {
	var obj = Crafty.e('SAShip').gameStateEntity(gameStateEntity);
	var p = gameStateEntity.getPlayerIndex();

	var collisionStr = "collisionPlayer";
	if (p == 0) {
		obj.color("blue");
	}
	else if (p == 1) {
		obj.color("red"); 
	}
	else
		throw new Error("bad colors");

/*
	var shipFront = Crafty.e('HAShipFront').attr({x:0, y:0})
	.color("black");
	shipFront.gameStateEntity = gameStateEntity;
	obj.attach(shipFront);
	//obj.attr({x:-100});

*/

	return obj;
}
SailboatGraphics.prototype.removeShipObj = function(craftyEntity) {
	craftyEntity.destroy();
}
SailboatGraphics.prototype.getNewBulletObj = function(gameStateEntity) {
	var obj = Crafty.e('HABullet').gameStateEntity(gameStateEntity);
	return obj;
}
