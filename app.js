var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var irc = require('irc');
var express = require("express");
app.use(express.static(__dirname));

app.get('/', function (req, res) {
	res.sendFile('/index.html');
	res.send('server is running');
});

io.on("connection", function (client) {

	client.on("join", function (name, channel) {

		var clientIrc = new irc.Client('irc.freenode.net', name, {
			autoConnect: false

		});

		clientIrc.connect(5, function (name) {
			console.log("Connected!");
			clientIrc.join(channel, function (name) {
				console.log(name);
				console.log("/join " + channel);
				clientIrc.say(channel, "Conectado");
				console.log("Joined: " + name);

			});

		});
		/*Emitida quando uma mensagem é enviada. To pode ser um nick (o que é mais provável que este Nick 
		 clientes e significa uma mensagem privada), ou um canal (que significa uma mensagem para esse canal).*/
		clientIrc.addListener('message', function (from, to, text) {
			console.log(from + ' => ' + to + ': ' + text);
			console.log("Message: " + text);
			client.emit('chat',from, text);
		});

		/**Emitido quando o servidor envia uma lista de nicks para um canal (o que acontece imediatamente após 
		 * a união e a pedido. O objeto nicks passado para o retorno de chamada é codificado por nick nomes e 
		 * tem valores '', '+' ou '@' dependendo No nível daquele nick no canal. */
		clientIrc.addListener('names', function (channel, nicks) {
			client.emit("update", "" ,nicks);
		});
		/**Emitido quando um usuário se junta a um canal (inclusive quando o próprio cliente se junta a um canal) */
		clientIrc.addListener('join', function (channel, nick) {
			client.emit("update", nick);
		});
		/**Emitida quando um usuário desconecta do IRC, deixando a matriz especificada de canais.*/
		clientIrc.addListener('quit', function (nick, reason, channels, message)  {
			console.log("quit");
		});
		/**Conforme o evento kick, mas apenas emite para o canal subscrito.  */
		clientIrc.addListener('kick#channel', function (nick, reason, channels, message) {
			console.log("kick#channel");
		}); 

		/**Emitido quando um usuário é morto do servidor IRC. Canais é um conjunto de canais que 
		* o usuário morto estava no qual são conhecidos pelo cliente */
		clientIrc.addListener('kill', function (nick, reason, channels, message) {
			console.log("kill");
		}); 
		
		/**Emitido quando uma mensagem é enviada para qualquer canal (ou seja , exatamente o mesmo 
		que o evento da mensagem , mas excluindo as mensagens privadas) */
		clientIrc.addListener('message#', function  (nick, to, text, message) {
			console.log("'message#");
		}); 
		/**Emitido sempre que o servidor responde com uma mensagem de tipo de erro. */
		clientIrc.addListener('error', function  (message) {
			console.log("Erro");
		});
		/**Emite sempre que um usuário executa uma ação (por exemplo / me waves ).  */
		clientIrc.addListener("action", function (from, to, text, message) {
			clientIrc.say(channel, msg);
		});

		client.on("disconnect", function () {
				clientIrc.disconnect();
				console.log("Disconnect");
		});

		client.on("send", function (msg) {
			console.log("MessageTeste: " + msg);
			clientIrc.say(channel, msg);			
		});
	});

});

http.listen(3000, function () {
	console.log('listening on port 3000');
	console.log('Acesse via Url');
	console.log('localhost:3000');
});
