define(["/reuseable/CodeManager"], function(CodeManager) {
  function SailboatBridge() {}
  var sbCodes = new CodeManager();
  sbCodes.registerCode("cmcTeamSelect", "t");
  //SailboatBridge.cmcTeamSelect = "t";
  SailboatBridge.registerCustomMessages = function(bridge) {
    bridge.codes.mergeOther(sbCodes);	
    bridge.customMessageManager.registerMessage(bridge.codes.cmcTeamSelect); 
  }
  SailboatBridge.Server = function(bridge) {
    SailboatBridge.registerCustomMessages(bridge); 
  }
  SailboatBridge.Client = function(bridge) {
    SailboatBridge.registerCustomMessages(bridge);
  }

}
);
/*
if (!this.___alexnorequire) {
	exports.SailboatBridge = SailboatBridge;
}
*/
