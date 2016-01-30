/**
 *
 */

var net = require('net');
var util = require('util');
var http = require('http');
var console = require('console');

var PROXY_PORT = 6969;
var API_KEY = 'fWhBM0UdCM64tEW1xOqCadzjj5v8Ea23';

var allow = { allowHalfOpen: false };
var server = net.createServer(allow, function(socket) {

    socket.on('data', function(data) {
        socket.write('data received');
        callExpediaAPI("Seattle", "2015-08-08", "2015-08-08");
    });
});

server.listen(PROXY_PORT, function() {
    util.log("Proxy listening on localhost:" + PROXY_PORT);
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

function callExpediaAPI(location, startDate, endDate) {
    util.log("request sent");

    var options = {
        host:'terminal2.expedia.com',
        port: 80,
        path: 'terminal2.expedia.com/x/activities/search?location=' + location + '&startDate=' + startDate +
                '&endDate=' + endDate + '&apikey=' + API_KEY,
        method: 'GET'
    };

    var req = http.request(options, function(res) {
        res.setEncoding('utf-8');

        var responseString = '';

        res.on('data', function(data) {
            responseString += data;
        });

        res.on('end', function() {
            //console.log(responseString);
            //console.log(typeof responseString);

            processResponse(obj);
            console.log("complete");
        });
    });

    req.end();
}


