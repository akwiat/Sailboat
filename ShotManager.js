var INITIAL_SHOTS = 2;
var PLAYERS_PER_TEAM = 2;

function ShotManager(playerId, teammates, onShoot, onDeactivate) {
	this.playerId = playerId; 				// key in global player array
	this.teammates = teammates; 			// array of teammates' IDs
	this.onShoot = onShoot;
	this.shotsRemaining = INITIAL_SHOTS;	// number of shots remaining for team
	this.shieldUp = false;					// defense shield status
	this.playerSheilds = []				// defense sheild status of all players
	for (var i = 0; i < PLAYERS_PER_TEAM * 2; i++) {
		this.playerSheilds.push(false);
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

// fn to update status if some other player has shot
ShotManager.prototype.shotOccured = function(shooter) {
	this.playerSheilds[shooter] = true;

	for (var i = 0; i < this.teammates.length; i++) {
		if (this.teammates[i] == shooter) {
			this.shotsRemaining--;
			return;
		}
	}
}

// fn to put up shield (called by server when shot is sent)
ShotManager.prototype.activateShield = function() {
	this.shieldUp = true;
}

// fn to take down shield (called by server shield expires)
ShotManager.prototype.deactivateShield = function() {
	this.shield = false;
}


// fm that says whos sheilds are up
ShotManager.prototype.currentShooters = function() {
	shooters = []
	for (var i = 0; i < this.playerSheilds; i++) {
		if (this.playerSheilds[i] = true) {
			shooters.push(i)
		}
	}
	return shooters;
}