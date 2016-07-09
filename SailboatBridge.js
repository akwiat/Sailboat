function SailboatBridge() {}
SailboatBridge.cmcTeamSelect = "t";
SailboatBridge.registerCustomMessages = function(bridge) {
  bridge.customMessageManager.registerMessage(cmcTeamSelect);
}
function SailboatServerBridge(bridge) {
  SailboatBridge.registerCustomMessages(bridge);
}
function SailboatClientBridge(bridge) {
  SailboatBridge.registerCustomMessages(bridge);
}
