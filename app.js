var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var irc = require('irc');


app.get('/', function (req, res) {
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
				client.emit("update", "Você se conectou ao bate-papo.");
				console.log("Joined: " + name);

			});

		});


		clientIrc.addListener('message', function (from, to, text) {
			console.log(from + ' => ' + to + ': ' + text);
			console.log("Message: " + text);
			client.emit('chat',from, text);
		});

		client.on("send", function (msg) {
			console.log("MessageTeste: " + msg);
			clientIrc.say(channel, msg);

		});

		client.on("disconnect", function () {
				clientIrc.disconnect();
				console.log("Disconnect");
		});



	});

});

http.listen(3000, function () {
	console.log('listening on port 3000');
});
