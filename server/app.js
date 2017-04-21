var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var irc = require('irc');

var clients = {}; 
var clientIrc;
app.get('/', function(req, res){
  res.send('server is running');
});

io.on("connection", function (client) {  
	
    client.on("join", function(name,channel){
			var name=name;
			var channel=channel;
    		clientIrc = new irc.Client('irc.freenode.net', name, {
				autoConnect: false
			});
			
			clientIrc.connect(5, function(name) {
				console.log("Connected!");
				//clientIrc.join('#p2-g4', function(name) {
				clientIrc.join(channel, function(name) {
				console.log(name);
				console.log("/join "+channel);
				clientIrc.say(channel, "Conectado");
				});
			});
			
			
			for(var k in clients) {
				if(clients[k]==name){
					console.log('Este nome de usuário já está em uso');
					return client.emit('update', "Este nome de usuário já está em uso");					
				}
			}			
		//console.log("Joined: " + name);
       // clients[client.id] = name;
		
        client.emit("update", "Você se conectou ao bate-papo.");
       // client.emit("update", "" ,clients);
		//client.broadcast.emit("update", name + " Se juntou ao bate-papo",clients);
		
		console.log(clients);
		
		clientIrc.addListener('message', function (from, to, text) {
			console.log(from + ' => ' + to + ': ' + text);
			 client.on("send", function(text){
				console.log("Message: " + text);
				client.broadcast.emit("chat", clients[client.id], text);
			});
		});
    });
	
	
	
	

    client.on("send", function(msg){
    	console.log("Message: " + msg);
        client.broadcast.emit("chat", clients[client.id], msg);
    });

    client.on("disconnect", function(){
		var nome=clients[client.id];
		if( nome!=undefined){
			console.log(nome);
			console.log("Disconnect");
			io.emit("update", clients[client.id] + " Deixou o bate-papo.");
			//tirando usuario da lista
			delete clients[client.id];
			client.broadcast.emit("update","",clients);
		}
        
    });
		
	
});

http.listen(3000, function(){
  console.log('listening on port 3000');
});
