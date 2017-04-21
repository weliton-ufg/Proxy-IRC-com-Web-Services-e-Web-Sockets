$(document).ready(function(){  
    var socket = io.connect("http://localhost:3000");
    var ready = false;

    $("#submit").submit(function(e) {
		e.preventDefault();
		$("#nick").fadeOut();
		$("#chat").fadeIn();
		$("#usuarios").fadeIn();
		var name = $("#nickname").val();
		var channel= $("#channel").val();
		var time = new Date();
		  $("#name").html(name);
		  $("#canal").html(channel);
		  $("#time").html('Online ' + time.getHours() + ':' + time.getMinutes());

		ready = true;
		socket.emit("join", name,channel);
	});

	$("#textarea").keypress(function(e){
        if(e.which == 13) {
			enviarMensagem();
        }
    });
	$("#btnenvia").click(function(e){
		enviarMensagem();
    });
      
    socket.on("update", function(msg,clients) {
    	if (ready) {
			if(msg==='Este nome de usuário já está em uso'){
			
          $('#msgvalidalogin').empty().append('');	
            		  
			$("#nick").fadeIn();
			$("#chat").fadeOut();
			 $('#msgvalidalogin').append('<span ><p class="validation">Este nome de usuário já está em uso</p></span>');
				
				return;
			}
			
		
			var time = new Date();	
			
				$('.chat').append('<li class="info"> '+ msg + ' </li>')
					if(clients!=null){
						$('.usuarios').empty().append('');
						for(var k in clients) {
							$('.usuarios').append('<div class="row sideBar-body "><div class="col-sm-3 col-xs-3 sideBar-avatar"><div class="avatar-icon"><img src="styles/user.jpg"></div></div><div class="col-sm-9 col-xs-9 sideBar-main ">' +clients[k] +'<div class="row"></div></div></div>');
							
						}
						
					}
			
    	}
    }); 
	//recebendo mensagem de outos usuário(s)
    socket.on("chat", function(client,msg) {
    	if (ready) {
	    	var time = new Date();
	    	$(".chat").append('<div class="row"><div class="receiver"><div class="message-text"><li><div class="msg"><span>' + client + ':</span><p>' + msg + '</p> <span class="message-time pull-right"> <time>' + time.getHours() + ':' + time.getMinutes() + '</time></div></div></li></div></div></div>');
    	}
    });

	
	function enviarMensagem(){
		var text = $("#textarea").val();
		if (notNull(text)){
			var text = $("#textarea").val();
			$("#textarea").val('');
			var time = new Date();
			$(".chat").append('<div class="row message-body"> <div class="col-sm-12message-main-sender"><div class="sender"><div class="message-text"><li><div class="msg"><span> Eu: </span><p>' + text + '</p> <span class="message-time pull-right"> <time>' + time.getHours() + ':' + time.getMinutes() + '</time></div></div></li></div></div></div></div>');
			socket.emit("send", text);
		}
	};
	function notNull (x){
			if(x!="" && !(x.match(/^\s+$/))){
				return true;
			}else{
				return false;
			}
	};
	
});




