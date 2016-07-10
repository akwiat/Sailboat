SailboatSettings = {
  InternalGameSize:1000
	,HumanShipRadius:25
	,AlienShipRadius:20
	,AlienShieldThicknessRadiusUnits:0.25
	//,ShipRadius:25
	,BulletRadius:20
	,BulletCooldown:2
	,AlienShieldWidthRadiusUnits:0.4
	,AlienShieldLengthRadiusUnits:3.0
	,AlienShieldStartYRadiusUnits:1.0
	,AlienShieldDuration:3
	,AlienShieldCooldown:5
	,HumanRespawnCooldown:4
	,AlienRespawnCooldown:3
	,HumanRespawnBox:{pos:{x:100,y:100}, w:800, h:100}
	,AlienRespawnBox:{pos:{x:100,y:800}, w:800, h:100}
	,HumanMaxV:200.0
	,AlienMaxV:300.0
	,AlienMaxA:7.5
	,HumanMaxA:5.0
	//
	,AlienAccFwd: 200.0
	,AlienAccRight: -12.0
	,HumanAccFwd: 150.0
	,HumanAccRight: -3.0

	,HumanTeamCode:"h"
	,AlienTeamCode:"a"
	,HumanTeamArray:"humanTeam"
	,AlienTeamArray:"alienTeam"


};

if (!this.___alexnorequire)
exports.SailboatSettings = SailboatSettings;
