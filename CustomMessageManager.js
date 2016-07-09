function CustomMessageManager() {
  this.dict = {};
}

CustomMessageManager.prototype.registerMessage = function(msgCode) {
  for (var i in this.dict) {
    if (this.dict.hasOwnProperty(i) && msgCode == i)
      throw new Error("repeated CustomMessage code");
  }
  this.dict[msgCode] = [];
}
CustomMessageManager.prototype.subscribeToMessage = function(msgCode, callback) {
  var callbackList = this.dict[msgCode];
  if (!callbackList) throw new Error("bad msgCode");
  callbackList.push(callback);
}
CustomMessageManager.prototype.triggerMessage = function(msgCode, msg) {
  var callbackList = this.dict[msgCode];
  if (!callbackList) throw new Error("bad msgCode");
  
  for (var i=0; i < callbackList.length; i++) {
    callbackList[i](msg);
  }
}

if (!this.___alexnorequire) {
  exports.CustomMessageManager = CustomMessageManager;
}