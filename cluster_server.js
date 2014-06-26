var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;
var fs = require('fs');

if (cluster.isMaster) {
    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died');
    });
} else {
    // Workers can share any TCP connection
    // In this case its a HTTP server
    http.createServer(handler).listen(8000);

    console.log('Worker ' + cluster.worker.id + ' running!');
}

function handler(request, response) {
    response.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    var fname =
        String.fromCharCode(
            65 + (Math.random() * 57.0) | 0,
            65 + (Math.random() * 57.0) | 0,
            65 + (Math.random() * 57.0) | 0,
            65 + (Math.random() * 57.0) | 0
    ) + '.txt';

    var buf = new Buffer(108000);

    for (var i = 0; i < 27000; i++) {
        buf.writeUInt32LE(
            ((65 + ((Math.random() * 57) | 0)) << 24) |
            ((65 + ((Math.random() * 57) | 0)) << 16) |
            ((65 + ((Math.random() * 57) | 0)) << 8) |
            ((65 + ((Math.random() * 57) | 0))),
            i << 2, false);
    }

    fs.writeFile(fname, buf, function(err, fd) {
        if (err) {
            response.writeHead(404);
            response.end();
            return;
        }
        fs.createReadStream(fname).pipe(response);
    });
}
