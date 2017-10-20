zmq = require('zmq')
, backAddr = 'tcp://127.0.0.1:12345'
, frontAddr = 'tcp://127.0.0.1:12346';
var i = -1;
var cw = 0;
var size = 2;
var max,gcd;

//Balanceo de carga Round Robin
function loadBalancerRR() {
  var workers = [] // list of available worker id's

  var backSvr = zmq.socket('router')
  backSvr.identity = 'backSvr' + process.pid
  backSvr.bind(backAddr, function(err) {
    if (err) throw err;

    backSvr.on('message', function() {
      // Any worker that messages us is ready for more work
      workers.push(arguments[0])
      if (arguments[2] != 'READY') {
        frontSvr.send([arguments[2], arguments[3], arguments[4]])
      }
    })
  })

  var frontSvr = zmq.socket('router');
  frontSvr.identity = 'frontSvr' + process.pid;
  frontSvr.bind(frontAddr, function(err) {
    if (err) throw err;

    frontSvr.on('message', function() {
      var args = Array.apply(null, arguments)

      var interval = setInterval(function() {
        if (workers.length > 0) {
          backSvr.send([workers.shift(), '', args[0], '', args[2]])
          clearInterval(interval)
        }
      }, 10)
    });
  });
}
//Balanceo de carga Random
function loadBalancerRandom() {
    var workers = [] // list of available worker id's

  var backSvr = zmq.socket('router')
  backSvr.identity = 'backSvr' + process.pid
  backSvr.bind(backAddr, function(err) {
    if (err) throw err;

    backSvr.on('message', function() {
      // Any worker that messages us is ready for more work
      
      if (arguments[2] != 'READY') {
        frontSvr.send([arguments[2], arguments[3], arguments[4]])
      }
      else{
	if(workers.indexOf(arguments[0])<0){
	 workers.push(arguments[0])
	}
      }
    })
  })

  var frontSvr = zmq.socket('router');
  frontSvr.identity = 'frontSvr' + process.pid;
  frontSvr.bind(frontAddr, function(err) {
    if (err) throw err;

    frontSvr.on('message', function() {
      var args = Array.apply(null, arguments)

      var interval = setInterval(function() {
        if (workers.length > 0) {
	  
	  var val = Math.floor((Math.random() * workers.length));
          backSvr.send([workers[val], '', args[0], '', args[2]])
          clearInterval(interval)
        }
      }, 10)
    });
  });
}
//Balanceo de carga Weighted Round Robin
function loadBalancerWRR() {
  var workers =[]; // list of available worker id's
  var pesos = [];
  

  var backSvr = zmq.socket('router')
  backSvr.identity = 'backSvr' + process.pid
  backSvr.bind(backAddr, function(err) {
    if (err) throw err;

    backSvr.on('message', function() {
      // Any worker that messages us is ready for more work
      
      if (arguments[2] != 'READY') {
        frontSvr.send([arguments[2], arguments[3], arguments[4]])
      }
      else{
	if(workers.indexOf(arguments[0])<0){
	  workers.push(arguments[0])
	  pesos.push(arguments[3])
	}
      }
    })
  })
  
  var frontSvr = zmq.socket('router');
  frontSvr.identity = 'frontSvr' + process.pid;
  frontSvr.bind(frontAddr, function(err) {
    

    if (err) throw err;

    frontSvr.on('message', function() {
      var args = Array.apply(null, arguments)
      
      var interval = setInterval(function() {
        if (workers.length > 0) {
	    size = workers.length;
	    max = getMaxValue(pesos);
	    gcd = getGcdOfArray(pesos);
	    while(true){
	      i = (i + 1) % size;
	      if (i == 0) {
		  cw = cw - gcd;
		  if (cw <= 0) {
		      cw = max;
		      if (cw == 0) {
			  return;
		      }
		  }
	      }
	      if (pesos[i] >= cw) {
		backSvr.send([workers[i], '', args[0], '', args[2]])
	        break;
	     }
	    }
	    
          clearInterval(interval)
        }
      }, 10)
    });
  });
}

function getGcdOfArray(array){
   result = array[0];
   for (j = 1; j < array.length; j++) {
            result = gcd2(result, array[j]);
   }
   return result;
}
function gcd2(number1, number2)
 {
   return !number2 ? number1 : gcd2(number2, number1 % number2);
}

function getMaxValue(array) {
  return Math.max.apply(null, array)
}

if( process.argv.length < 3 ) {
    console.log("Parametros incorrectos");
    console.log("Modo de ejecucion: node load_balancing.js <TIPO>");
    process.exit(1);
}
var typebalancing = process.argv[2];

if(typebalancing==="random"){
  loadBalancerRandom();
}
else if(typebalancing==="roundRobin"){
  loadBalancerRR();
}
else if(typebalancing==="weightedRoundRobin"){
  loadBalancerWRR();
}