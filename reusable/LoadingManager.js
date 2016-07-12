define( function() {
    function LoadingManager(strArray, completeFn) { //is LoadingManager
      this.codes = new CodeManager();
        this.codes.register("returncallback");
      this.requirements = {};
      this.loadFns = [];
      if(strArray) for (var o of strArray) this.registerRequirement(o);
      this.completeFunction = completeFn;
    }
    LoadingManager.prototype.beginLoading = function() {
        for (var i=0; i < this.loadFns.length; i++)
          this.loadFns[i]();
    }
    LoadingManager.prototype.registerRequirement(str, fn, shouldReturnCallback) {
        if (shouldReturnCallback && shouldReturnCallback != this.codes.returncallback) throw new Error("bad code");
      
        if (this.requirements[str] !== undefined) throw new Error("bad requirement: "+str);
      this.requirements[str] = false;
      
      var onComplete = this.completeRequirement.bind(this, str);
      this.loadFns.push(fn.bind(null, onComplete)); //fn accepts the callback as its argument. this stores that to be called on beginLoading
      if (shouldReturnCallback) {
        return onComplete;
      }
        
    }
    LoadingManager.prototype.completeRequirement(str) {
      if (this.requirements[str] !== false) throw new Error("bad completed requirement: "+str);
      this.requirements[str] = true;
      this.checkForComplete();
    }
    LoadingManager.prototype.checkIfCompleted = function(str) {
      if (this.requirements[str] === undefined) throw new Error("bad checkIfComplete: "+str);
      return this.requirements[str];
    }
    LoadingManager.prototype.checkForComplete = function() {
      for (var o of this.requirements) {
        if (!this.requirements[o]) return false;
      }
      this.completeFunction();
      return true;
    }
    LoadingManager.RETURNCALLBACK = "returncallback";
    return LoadingManager;
  }
);
