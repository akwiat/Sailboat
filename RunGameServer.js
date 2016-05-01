var InitializeServerStructure = require("./GameStructure").InitializeServerStructure;
var Sailboat = require("./Sailboat").Sailboat;
var gameStructure = new InitializeServerStructure(Sailboat.getInitObj());
var sailboatServer = new Sailboat.Server(gameStructure);

