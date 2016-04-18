var INITIAL_SHOTS = 2;
var PLAYERS_PER_TEAM = 2;

function ShotManager(playerId, teammates, onShoot, onDeactivate) {
  this.playerId = playerId;         		// key in global player array
  this.teammates = teammates;       		// array of teammates' IDs
  this.onShoot = onShoot;								// callback to invoke on shooting
  this.shotsRemaining = INITIAL_SHOTS;  // number of shots remaining for team
  this.shieldUp = false;          			// defense shield status
  this.playerShields = []        				// defense shield status of all players
  for (var i = 0; i < PLAYERS_PER_TEAM * 2; i++) {
    this.playerShields.push(false);
  }
}

ShotManager.prototype.shoot = function() {
  if (this.shotsRemaining > 0) {
    this.shotsRemaining--;
    this.activateShield();
    // TODO: start shield timer
    // TODO: call onShoot
    return true;
  } else {
    return false;
  }
}

ShotManager.prototype.shotOccurred = function(shooter) {
  this.playerShields[shooter] = true;

  for (var i = 0; i < this.teammates.length; i++) {
    if (this.teammates[i] == shooter) {
      this.shotsRemaining--;
      return;
    }
  }
}

ShotManager.prototype.activateShield = function() {
  this.shieldUp = true;
}

ShotManager.prototype.deactivateShield = function() {
  this.shield = false;
}


ShotManager.prototype.currentShooters = function() {
  shooters = []
  for (var i = 0; i < this.playerShields; i++) {
    if (this.playerShields[i] = true) {
      shooters.push(i);
    }
  }
  return shooters;
}