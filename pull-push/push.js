var zmq = require("zmq");

var push = zmq.socket("push");

var count = 0;
push.bind("tcp://127.0.0.1:8888", 
function(err) { 
	if (err) throw err;
	setInterval(function() {
		count++;
		if(count % 3 == 0){
			msg = "Hello World";
		}
		else if(count % 3 == 1){
			msg = "Hello2 World";
		}
		else{
			msg = "Hello2 World2";
		}

		var t = push.send(msg);
}, 1000); });