var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var irc = require('irc');
var express = require("express");
app.use(express.static(__dirname));

app.get('/', function (req, res) {
	res.sendFile('/teste.html');
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


		clientIrc.addListener('message', function (from, to, text) {
			console.log(from + ' => ' + to + ': ' + text);
			console.log("Message: " + text);
			client.emit('chat',from, text);
		});

		clientIrc.addListener('names', function (channel, nicks) {
			console.log("Teste Names");
			console.log("channel: " + channel);
			console.log("nicks: " + nicks);
			client.emit("update", "" ,nicks);
		});

		clientIrc.addListener('join', function (channel, nick) {
			console.log("Teste join");
			client.emit("update", nick);
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
	console.log('Acesse via Url');
	console.log('localhost:3000');
});
