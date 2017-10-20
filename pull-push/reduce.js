var zmq = require("zmq");

var pull = zmq.socket("pull");

var l = {};

pull.connect("tcp://127.0.0.1:8889");
pull.connect("tcp://127.0.0.1:8887");

pull.on("message", function(msg) { 
	if(msg in l){
		l[msg]++
	}
	else{
		l[msg] = 1
	}
	console.log(l);
});