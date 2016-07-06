var InitializeServerStructure = require("./GameStructure").InitializeServerStructure;
var Sailboat = require("./Sailboat").Sailboat;
var gameStructure = new InitializeServerStructure(Sailboat.getInitObj());
//Sailboat.Server(gameStructure); //now Sailboat.Server is just a function that makes the necessary customizations

