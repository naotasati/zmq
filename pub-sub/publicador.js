var zmq = require('zmq');

var sock = zmq.socket('pub');


sock.bind("tcp://127.0.0.1:8888");

setInterval(function() { count++; if((count % 2) == 0) {sock.send("TEST1 " + count);} else {sock.send("TEST2 " + count);}
}, 1000);
