var util = require("util");				

var AlexUtil = require("./AlexUtils").AlexUtil;
var ServerBridge = require("./ServerBridge").ServerBridge;
var WebSocketServer = require('ws').Server
  , http = require('http')
  , express = require('express')
  , app = express()
 // , port = process.env.PORT || 8000;

  app.use(express.static(__dirname + '/'));




function GameServer() {
ween server/client
this.serverBridge = new ServerBridge();


this.server = http.createServer(app);

var port = process.env.PORT || this.serverBridge.portNumber;
util.log(port);
this.server.listen(port);

util.log("http server listening on: "+port);
this.wss = new WebSocketServer({server: this.server});
this.wss.alexidlist = [];
util.log('websocket server created');

this.wss.broadcast = function(data) {
  for (var i in this.clients)
    this.clients[i].send(data);
};




this.wss.on('connection', this.onSocketConnection.bind(this))


}
GameServer.prototype.onMessage = function(msg) {
  this.serverHandlerLink.onMessage(msg);
}

GameServer.prototype.onSocketConnection = function(ws) {
  util.log("New player has connected.");



ws.on('close',this.onSocketClose.bind(this));
ws.on('message', this.onMessage.bind(this));

var id = this.makeNewId(ws);
this.serverHandlerLink.onNewConnection(id);

}
GameServer.prototype.makeNewId = function(ws) {
  var id =  AlexUtil.getNextAvailable(this.wss.alexidlist);
  ws.alexid = id;
  this.wss.alexidlist[id] = true;
  return id;

}
GameServer.prototype.sendToClient = function(id, msg) {
  for (var i in this.wss.clients) {
    if (this.wss.clients[i].alexid == id) {
      util.log("GameServer::sendToClient: "+msg);
      this.wss.clients[i].send(msg);
    }
  }
}
GameServer.prototype.sendToAllClientsCallback = function(callback) {
  for (var i in this.wss.clients) {
    var ws = this.wss.clients[i];
    callback(ws, ws.alexid); // a bit silly since you have to look up the client twice
  }
}

GameServer.prototype.onSocketClose = function() {
    //util.log("a client closed...");
  for (var i = 0,l=this.wss.alexidlist.length; i < l; i++)
  {
    var found = false;
    var hasid = this.wss.alexidlist[i];
    if (hasid != undefined) {//true if id exists
      for (var j in this.wss.clients) {
        if (this.wss.clients[j].alexid == i) found = true;
           //wss.clients[i].send(data);
      }
      if (found == false) {
        util.log("a client closed: "+i);
        this.serverHandlerLink.clientDisconnected(i);
        this.wss.alexidlist[i] = undefined;
      }
    }
  }
}
exports.GameServer = GameServer;

