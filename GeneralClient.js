function GeneralClient(loadGraphicsFn, initObj) {
  this.loadGraphicsFn = loadGraphicsFn;
  this.initObj = initObj;
  
  if (this.loadGraphicsFn)
    this.loadGraphicsFn(this.onLoad.bind(this));
  //this.loadGraphics();
  //if (GeneralGraphics.loadEverything)
	  //GeneralGraphics.loadEverything(this.onLoad.bind(this));
}

GeneralClient.prototype.onLoad = function() {
	this.gameStructure = new InitializeClientStructure(this.initObj);
}

GeneralClient.prototype.updateLoop = function() {
	if (this["gameHandler"].myPlayer) {
		var frag = this["gameHandler"].myPlayer.getSpecificFrag();
		frag.setDestinationNotMe();
		//frag.setDestination(FragDestination.notMe());
		this["gameHandler"].sendstate.add(frag);
		this["handlerBridge"].sendUpdateToServer();
	}
	
}
/*
function BaseClient() {
	
}

BaseClient.prototype.updateLoop = function() {
	var updateLoop = function() {
		if (this["gameHandler"].myPlayer) {
		var frag = this["gameHandler"].myPlayer.getSpecificFrag();
		frag.setDestinationNotMe();
		//frag.setDestination(FragDestination.notMe());
		this["gameHandler"].sendstate.add(frag);
		this["handlerBridge"].sendUpdateToServer();
		}
	}
}
BaseClient.prototype.activate = function() {
	this.updateLoopId = setInterval(this.updateLoop.bind(this.gameStructure), 50);
}
*/
