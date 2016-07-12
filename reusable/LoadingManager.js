define( function() {
    function LoadingManager(strArray, completeFn) { //is LoadingManager
      this.requirements = {};
      if(strArray) for (var o of strArray) this.registerRequirement(o);
      this.completeFunction = completeFn;
    }
    LoadingManager.prototype.registerRequirement(str) {
      if (this.requirements[str] !== undefined) throw new Error("bad requirement: "+str);
      this.requirements[str] = false;
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
  }
);
