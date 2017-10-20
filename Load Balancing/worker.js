zmq = require('zmq')
, backAddr = 'tcp://127.0.0.1:12345';
var sock = zmq.socket('req');
if( process.argv.length < 3 ) {
    console.log("Parametros incorrectos");
    console.log("Modo de ejecucion: node worker.js PUERTO PESO");
    process.exit(1);
  } 
sock.identity = "workerlocalhost:" + + process.argv[2]
sock.connect(backAddr)
sock.send(['READY',process.argv[3]])

sock.on('message', function() {
  var args = Array.apply(null, arguments)
  console.log("'" + args + "' -> " + sock.identity);
  sock.send([arguments[0], '', 'OK'])
})
