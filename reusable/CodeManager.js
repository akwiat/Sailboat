define( function() {
  function CodeManager() {
  }
  CodeManager.prototype.registerCode = function(str) {
    this[str] = str;
  }  

}  
);
