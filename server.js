var http = require('http');
var server = http.createServer(handler);
var fs = require('fs');

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
server.listen(8080);
console.log('Server running at http://127.0.0.1:8080/');
