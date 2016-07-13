define( function() {
  function CodeManager() {
  }
  CodeManager.prototype.registerCode = function(str, internal) {
    var irep = internal || str;
    this[str] = irep;
  }  

}  
);
