var zmq = require("zmq");
var pull = zmq.socket("pull");
var push = zmq.socket("push");
if( process.argv.length < 3) {
	console.log("Parametros incorrectos");
    console.log("Modo de ejecucion: node pull.js NUMERO");
    console.log("SUB: 9 or 7")
    process.exit(1);
    }
push.bind("tcp://127.0.0.1:888"+process.argv[2]);
pull.connect("tcp://127.0.0.1:8888");

pull.on("message", function(msg) { 
	var listorld = msg.toString().split(" ");
	for(l in listorld){
		push.send(listorld[l]);
	}
});