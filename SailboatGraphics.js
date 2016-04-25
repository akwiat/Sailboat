function SailboatGraphics(graphicsSettings) {
	
	CraftyGraphics.call(this, graphicsSettings);

	var HumanShipRadius = graphicsSettings.HumanShipRadius;
	var AlienShipRadius = graphicsSettings.AlienShipRadius;
	var AlienShieldRadius = graphicsSettings.AlienShieldRadius;
	var BulletRadius = graphicsSettings.BulletRadius;
	var GraphicsRatio = this.ratio;

	var graphicsObj = this;

	Crafty.c("HumanShip", {
		required: "PropCircleMover, human"
		,init: function() {
			console.log("init");
			//debugger;
			this.w = HumanShipRadius*2.0*GraphicsRatio;
			this.h = this.w;
			/*
			this.w = ShipWidth*GraphicsRatio;
			this.h = this.w*ShipAspect;
			*/
			//this.origin(this.w/2, this.h/2);
			this.origin("center");
			//this.color("blue");
			//this.x = this.w; this.y = this.h;
			this.rotation = 0;
			//this.color("black");
		}
		/*
		,events: {
			"EnterFrame":function() {
				this.rotation += .5;
			}
		}
		*/
	});
	Crafty.c("AlienShip", {
		required: "PropCircleMover, ufo"
		,init: function() {
			//console.log("init");
			this.w = AlienShipRadius*2.0*GraphicsRatio;
			this.h = this.w;
			this.origin("center");
			//this.color("blue");
			this.rotation = 0;
			
		}
	});
	Crafty.c("AlienShield", {
		required: "GameStateEntity"
		,init: function() {
			//var shieldBox = Crafty.e("Box");
			//console.log("initalienShield");
			var shieldCircle = Crafty.e("2D, Canvas, Color, shield");
			//shieldCircle.color("green");
			//shieldCircle.alpha = 0.3;
			var shieldR = (1+graphicsSettings.AlienShieldThicknessRadiusUnits)*AlienShipRadius;
			shieldCircle.w = shieldR*2.0*GraphicsRatio;
			shieldCircle.h = shieldCircle.w;
			//shieldCircle.origin("center");
			shieldCircle.x = -1*(shieldR - AlienShipRadius) * GraphicsRatio;
			shieldCircle.y = shieldCircle.x;
			this.attach(shieldCircle);

			var shieldBox = Crafty.e("Box");
			shieldBox.origin("center");
			var shieldBoxW = graphicsSettings.AlienShieldWidthRadiusUnits*AlienShipRadius;
			var shieldBoxH = graphicsSettings.AlienShieldLengthRadiusUnits*AlienShipRadius;
			shieldBox.w = shieldBoxW*GraphicsRatio;
			shieldBox.h = shieldBoxH*GraphicsRatio;
			shieldBox.x = (AlienShipRadius - shieldBoxW/2)*GraphicsRatio;
			shieldBox.y = (AlienShipRadius - shieldBoxH/2)*GraphicsRatio;

			shieldBox.y -= graphicsSettings.AlienShieldStartYRadiusUnits*AlienShipRadius*GraphicsRatio;//move center to top of ship
			shieldBox.y -= shieldBox.h/2; //move box origin to bottom middle
			shieldBox.color("red");
			this.attach(shieldBox);
			/*
			this.origin("center");
			this.w = AlienShieldRadius*2.0*GraphicsRatio;
			this.h = this.w;
			
			this.x = 0; this.y = 0;
			this.color("red");
			*/
		}
		,events: {
			"UpdateFromGameState": function() {
				if (this.gameStateEntity) {
					var shieldUp = this.gameStateEntity.wrappedObj.shieldUp;
					if (shieldUp){
						for (var i=0; i<this._children.length; i++) {
							this._children[i].visible = true;
						}
					} else {
						for (var i=0; i<this._children.length; i++) {
							this._children[i].visible = false;
						}
					}

					//if (shieldUp) console.log("shieldUp");
				}
			}
		}
	});
	Crafty.c("SABullet", {
		required: "PropPosition, bullet"
		,init:function() {
			this.w = BulletRadius*2.0*GraphicsRatio;
			this.h = this.w;
			this.origin("center");
		}
	});
	Crafty.c("EffectExplosion", {
		required: "2D, Canvas, Color, AlexEffect, explosion"
		,init:function() {
			this.w = BulletRadius*2.0*GraphicsRatio;
			this.h = this.w;
			this.origin("center");
			//console.log("init explosion");
		}
	});
	Crafty.c("BackgroundStars", {
		required: "2D, Canvas, Color"
		,init:function() {
			var numStars = 30;
			var starSize = 3.0*GraphicsRatio;
			var gameSize = graphicsSettings.InternalGameSize;
			for (var i=0; i < numStars; i++) {
				var x = Math.random()*gameSize;
				var y = Math.random()*gameSize;
				var nEnt = Crafty.e("2D, Canvas, Color");
				nEnt.color("#F2F2F1");
				nEnt.w = starSize;
				nEnt.h = nEnt.w;
				graphicsObj.setEntityGraphicsCoords(nEnt, x, y);
				this.attach(nEnt);
			}
		}
	});

	Crafty.e("BackgroundStars");

}
SailboatGraphics.prototype = Object.create(CraftyGraphics.prototype);
SailboatGraphics.prototype.constructor = SailboatGraphics;

SailboatGraphics.prototype.getNewHumanShip = function(gameStateEntity) {
	var obj = Crafty.e("HumanShip").gameStateEntity(gameStateEntity);
	//var p = gameStateEntity.getPlayerIndex();

	//var collisionStr = "collisionPlayer";
	return obj;
}
SailboatGraphics.prototype.getNewAlienShip = function(gameStateEntity) {
	var obj = Crafty.e("AlienShip").gameStateEntity(gameStateEntity);

	var gameStateShield = gameStateEntity.findDirectChildWithIdentifier("shield");
	if (gameStateShield == undefined) throw new Error("shield problem");
	var shieldObj = Crafty.e("AlienShield").gameStateEntity(gameStateShield);
	//shieldObj.visible = false;
	obj.attach(shieldObj);
	return obj;
}
SailboatGraphics.prototype.removeShipObj = function(craftyEntity) {
	console.log("removeShipObj");
	craftyEntity.destroy();
}
SailboatGraphics.prototype.getNewBulletObj = function(gameStateEntity) {
	var obj = Crafty.e('SABullet').gameStateEntity(gameStateEntity);
	return obj;
}
SailboatGraphics.prototype.drawExplosion = function(gsentity) {
	var cv = gsentity.getCurrentValues();
	var x = cv.x;
	var y = cv.y;
	//var x = gsentity.wrappedObj.currentValues.x;
	//var y = gsentity.wrappedObj.currentValues.y;
	//debugger;

	var entity = Crafty.e("EffectExplosion");

	var gameC = this.convertToGraphicsCoord(cv.x, cv.y, entity.w, entity.h);
	entity.x = gameC.x;
	entity.y = gameC.y;
	//entity.x = cv.x;
	//entity.y = cv.y;
	entity.setDuration(3.0);
	entity.startEffect();
}
SailboatGraphics.loadEverything = function(callback) {
	var assetsObj = {
		"sprites":{
			"ufo.png": {
				tile:50
				,tileh:50
				,map: {
					ufo:[0,0]
				}
			}
			,"explosion.png": {
				tile:65
				,tileh:66
				,map: {
					explosion:[0,0]
				}
			}
			,"shield.png": {
				tile:65
				,tileh:65
				,map: {
					shield:[0,0]
				}
			}
			,"circletest.png": {
				tile:38
				,tileh:38
				,map:{
					bullet:[0,0]
				}
			}
			,"shiptest1.png": {
				tile:71
				,tileh:69
				,map:{
					human:[0,0]
				}
			}
		}
	};
	
	Crafty.load(assetsObj, callback);
}
