$(document).ready(function () {
	var socket = io.connect("http://localhost:3000");
	var ready = false;

	$("#submit").submit(function (e) {
		e.preventDefault();
		$("#nick").fadeOut();
		$("#chat").fadeIn();
		$("#usuarios").fadeIn();
		var name = $("#nickname").val();
		var channel = $("#channel").val();
		var time = new Date();
		$("#name").html(name);
		$("#canal").html(channel);
		$("#time").html('Online ' + time.getHours() + ':' + time.getMinutes());

		socket.emit("join", name, channel);
		ready = true;
	});

	$("#textarea").keypress(function (e) {
		if (e.which == 13) {
			enviarMensagem();
		}
	});
	$("#btnenvia").click(function (e) {
		enviarMensagem();
	});

	socket.on("update", function (msg, clients) {
		if (ready) {
			if (msg === 'Este nome de usuário já está em uso') {

				$('#msgvalidalogin').empty().append('');

				$("#nick").fadeIn();
				$("#chat").fadeOut();
				$('#msgvalidalogin').append('<span ><p class="validation">Este nome de usuário já está em uso</p></span>');
				return;
			}

			var time = new Date();
			if (msg !== "") {
				var info=null;	
				console.log("msg "+msg);
					console.log("nickname "+$("#nickname").val());
				if(msg===$("#nickname").val()){
					info="Você se conectou ao bate-papo.";
					msg=="";
				}else{
					info= msg+" se conectou ao bate-papo.";
					msg=="";
				}
				$('.chat').append('<li style="margin-bottom: 4px;" class="info"> ' + info + ' </li>')
			}


			if (clients != null) {
				$('.usuarios').empty().append('');
				for (var k in clients) {
					console.log("clients " + k);
					$('.usuarios').append('<div class="row sideBar-body "><div class="col-sm-3 col-xs-3 sideBar-avatar"><div class="avatar-icon"><img src="lib/styles/user.jpg"></div></div><div class="col-sm-9 col-xs-9 sideBar-main ">' + k + '<div class="row"></div></div></div>');

				}

			}

		}
	});

	//recebendo mensagem de outos usuário(s)
	socket.on("chat", function (client, msg) {
		if (ready) {
			var time = new Date();
			$(".chat").append('<div class="row"><div class="receiver"><div class="message-text"><li><div class="msg"><span>' + client + ':</span><p>' + msg + '</p> <span class="message-time pull-right"> <time>' + time.getHours() + ':' + time.getMinutes() + '</time></div></div></li></div></div></div>');
			$("#chat").animate({ scrollTop: $('#chat').prop("scrollHeight") }, 500);
			$("#conversation").scrollTop($("#conversation").scrollTop() + $("#conversation").innerHeight());
		}
	});

	function enviarMensagem() {
		var text = $("#textarea").val();
		if (notNull(text)) {
			var text = $("#textarea").val();
			$("#textarea").val('');
			var time = new Date();
			$(".chat").append('<div class="row message-body"> <div class="col-sm-12message-main-sender"><div class="sender"><div class="message-text"><li><div class="msg"><span> Eu: </span><p>' + text + '</p> <span class="message-time pull-right"> <time>' + time.getHours() + ':' + time.getMinutes() + '</time></div></div></li></div></div></div></div>');
			$("#conversation").scrollTop($("#conversation").scrollTop() + $("#conversation").innerHeight());
			socket.emit("send", text);
		}
	};

	function notNull(x) {
		if (x != "" && !(x.match(/^\s+$/))) {
			return true;
		} else {
			return false;
		}
	};

});




