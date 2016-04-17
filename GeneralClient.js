function GeneralClient(loadGraphicsFn, initObj) {
  this.loadGraphicsFn = loadGraphicsFn;
  this.initObj = initObj;
  
  if (this.loadGraphicsFn)
    this.loadGraphcisFn(this.onLoad.bind(this));
  //this.loadGraphics();
  //if (GeneralGraphics.loadEverything)
	  //GeneralGraphics.loadEverything(this.onLoad.bind(this));
}

GeneralClient.prototype.onLoad = function() {
	this.gameStructure = new InitializeClientStructure(this.initObj);
}


