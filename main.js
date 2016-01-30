/**
 *
 */

var net = require('net');
var util = require('util');
var http = require('http');
var console = require('console')

var PROXY_PORT = 6969;

var allow = { allowHalfOpen: false };
var server = net.createServer(allow, function(socket) {

    socket.on('data', function(data) {
        socket.write('data');
        callExpedia();
    });
});

server.listen(PROXY_PORT, function() {
    util.log("Proxy listening on localhost:" + proxy_port);
});

server.on('error', function(e) {
    util.log(e);
    process.exit(-1);
});

// this needs to be here for EOF to work
process.stdin.on('data', function(data) {});

// close on EOF on stdin
process.stdin.on('end', function() {
    process.exit(0);
});

function callExpedia() {
    var options = {
        host:'terminal2.expedia.com',
        port: 80,
        path: '/x/hotels?location=47.6063889,-122.3308333&radius=5km&apikey=fWhBM0UdCM64tEW1xOqCadzjj5v8Ea23',
        method: 'GET'
    };

    var req = http.request(options, function(res) {
        res.setEncoding('utf-8');

        var responseString = '';

        res.on('data', function(data) {
            responseString += data;
        });

        res.on('end', function() {
            console.log(responseString);
        });
    });

    req.end();
}
