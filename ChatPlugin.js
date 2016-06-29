function ChatPlugin(gameStructure) {
	var sendFunction = function(chatMessage, sendable, clientLocationStr) {
		var shouldSend = chatMessage.checkIfSend(clientLocationStr);
		if (shouldSend)
		  sendable.send(msg);
	}
  var onCustomMsg = function(msg) {
  	if (msg.charAt(0) == ChatPlugin.CUSTOMMSGCODE) {
  		var msgStr = msg.slice(1);
  		var chatMessage = ChatMessage.makeFromStr(msgStr);
  		chatSendFunction = sendFunction.bind(undefined, chatMessage);
  		gameStructure["serverHandlerLink"].sendToAllClientsCallback(chatSendFunction);
  		//var shouldSend = chatMessage.checkIfSend(clientLocationStr);
  	}
  }
}
ChatPlugin.CUSTOMMSGCODE = "c";

function ChatMessage() {
	this.senderLocationString = undefined;
	this.destination = undefined;
	this.msg = undefined;
}
ChatMessage.prototype.checkIfSend = function(clientLocationStr) {
	  if (!clientLocationStr) throw new Error("bad clientLocationStr");
	return this.destination.checkIfSend(this.senderLocationString, clientLocationStr);
}
ChatMessage.prototype.toJSON = function() {
	return {
		d:this.destination,
		m:this.msg,
		s:this.senderLocationString
	};
}

ChatMessage.makeFromObj = function(obj) {
	var ret = new ChatMessage();
	ret.destination = obj.d;
	ret.msg = obj.m;
	ret.senderLocationString = obj.s;
	return ret;
}

ChatMessage.makeFromStr = function(str) {
	var obj = JSON.parse(str);
	return ChatMessage.makeFromObj(obj);
}