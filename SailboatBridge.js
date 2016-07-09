function SailboatBridge() {}
SailboatBridge.cmcTeamSelect = "t";
SailboatBridge.registerCustomMessages = function(bridge) {
  bridge.customMessageManager.registerMessage(SailboatBridge.cmcTeamSelect);
}
SailboatBridge.Server = function(bridge) {
  SailboatBridge.registerCustomMessages(bridge);
}
SailboatBridge.Client = function(bridge) {
  SailboatBridge.registerCustomMessages(bridge);
}

if (!this.___alexnorequire) {
	exports.SailboatBridge = SailboatBridge;
}