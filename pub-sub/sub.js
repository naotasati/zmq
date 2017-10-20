var zmq = require('zmq');
var sub = zmq.socket('sub');
if( process.argv.length < 3) {
	console.log("Parametros incorrectos");
    console.log("Modo de ejecucion: node sub.js SUB");
    console.log("SUB: TEST1 or TEST2")
    process.exit(1);
    }
sub.connect("tcp://localhost:8888") 
sub.subscribe(process.argv[2]);
sub.on("message", function(msg) {
console.log("Received: " + msg); });