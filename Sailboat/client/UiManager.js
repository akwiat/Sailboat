function UiManager() {
	this.callbacks = new Callbacks();

	document.getElementById("aliensButton").onclick = function() {
		
		this.callbacks.trigger(undefined, UiManager.ALIENBUTTON);	
		//debugger;
	}.bind(this);

	document.getElementById("humansButton").onclick = function() {
		
		this.callbacks.trigger(undefined, UiManager.HUMANBUTTON);	
		//debugger;
	}.bind(this);

	this.displayTeamSelect();

}
UiManager.prototype.hideTeamSelect = function() {
	document.getElementById("teamSelect").style.visibility = "hidden";
}
UiManager.prototype.displayTeamSelect = function() {
	document.getElementById("teamSelect").style.visibility = "visible";
	/*
	document.getElementById("aliensButton").onclick = function() {
		
		e("alienTeam");	
	}
	
	document.getElementById("humansButton").onclick = function() {
		document.getElementById("teamSelect").style.visibility = "hidden";
		e("humanTeam");
	}
	*/
}
UiManager.ALIENBUTTON = "alienButton";
UiManager.HUMANBUTTON = "humanButton";