function ClientBehavior() {
  this.loopManager = {};
}
ClientBehavior.prototype.registerLoop = function(name, period, fn) {
  if(this.loopManager[name] != undefined) throw new Error("repeated loop name");
  
  this.loopManager[name] = {period:period, loopId:undefined, fn:fn};
}

ClientBehavior.prototype.activate = function() {
  for (var o of this.loopManager) {
    o.loopId = setInterval(o.fn, o.period);
  }
  
  if (this.customActivate) this.customActivate();
}

ClientBehavior.prototype.deactivate = function() {
  for (var o of this.loopManager) {
    clearInterval(o.loopId);
  }
  
  if (this.customDeactivate) this.customDeactivate();
}
