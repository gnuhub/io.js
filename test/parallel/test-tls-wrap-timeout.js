var common = require('../common');
var assert = require('assert');

if (!common.hasCrypto) {
  console.log('1..0 # Skipped: missing crypto');
  process.exit();
}
var tls = require('tls');

var net = require('net');
var fs = require('fs');

var options = {
  key: fs.readFileSync(common.fixturesDir + '/keys/agent1-key.pem'),
  cert: fs.readFileSync(common.fixturesDir + '/keys/agent1-cert.pem')
};

var server = tls.createServer(options, function(c) {
  setTimeout(function() {
    c.write('hello');
    setTimeout(function() {
      c.destroy();
      server.close();
    }, 75);
  }, 75);
});

server.listen(common.PORT, function() {
  var socket = net.connect(common.PORT, function() {
    socket.setTimeout(120, assert.fail);

    var tsocket = tls.connect({
      socket: socket,
      rejectUnauthorized: false
    });
    tsocket.resume();
  });
});
