zmq = require('zmq')
, frontAddr = 'tcp://127.0.0.1:12346';
  if( process.argv.length < 3 ) {
    console.log("Parametros incorrectos");
    console.log("Modo de ejecucion: node client.js PUERTO");
    process.exit(1);
  } 
 var sock = zmq.socket('req');
 sock.identity = "clientlocalhost:" + process.argv[2];
 var identity = "clientlocalhost:" + process.argv[2];
 sock.connect(frontAddr)
 sock.send("HELLO")
  
 sock.on('message', function(data){
      console.log(identity + " <- '" + data + "'");
      sock.close()
  });