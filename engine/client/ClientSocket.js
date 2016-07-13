//function ClientSocket(handlerLink) {
function ClientSocket() {
  //this.handlerLink  = handlerLink;
  //this.hbcs is implicit
	this.host = location.origin.replace(/^http/, 'ws');
  this.serverBridge = new ServerBridge(); // to synch with the serverSide
    //console.log(host);
	      var h2 = "ws://localhost:"+this.serverBridge.portNumber;
	      console.log("client up")
          var actualhost;
          if (this.host.search("localhost") != -1)
            actualhost = h2;
           else
            actualhost = this.host;
        console.log(actualhost);
      this.ws = new WebSocket(actualhost);
      this.ws.onclose = function(event) {
        console.log("the socket died...");
        debugger;
      }
      this.ws.onmessage = this.onMessage.bind(this);

}
ClientSocket.prototype.onMessage = function(event) {
    //console.log("rec msg")
    this.handlerBridge.receiveMsg(event.data);
}
ClientSocket.prototype.send = function(msg) {
  //console.log("sending msg: "+msg);
  this.ws.send(msg);
}
/*
function TestInherit() {
	AlexInheritConstructor(this,GameState);
}
AlexInheritDetails(TestInherit,GameState);
*/