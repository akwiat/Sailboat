define( function() {
  function CodeManager() {
  }
  CodeManager.prototype.registerCode = function(str, internal) {
    var irep = internal || str;
    this[str] = irep;
  }  
  CodeManager.prototype.mergeOther = function(otherCodes) {
    for (var i in otherCodes)
      this[i] = otherCodes[i];
  }
}  
);
