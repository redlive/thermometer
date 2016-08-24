var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs")

var concat = require('concat-files');

concat([
    './assets/css/app.css',
    './assets/fonts/style.css',
    './modules/core/thermo/thermo.css'
], './dist/app.concate.css', function(c) {
    console.log('done css concate');
});

concat([
    './modules/core/thermo/thermo.module.js',
    './modules/core/thermo/thermo.service.js',
    './modules/core/thermo/thermo.component.js',
    './modules/utils/converters/converters.module.js',
    './modules/utils/converters/converters.service.js',
    './assets/js/app.js',
], './dist/app.concate.js', function(c) {
    console.log('done js concate');
});


port = process.argv[2] || 8888;

http.createServer(function(request, response) {

    var uri = url.parse(request.url).pathname
        , filename = path.join(process.cwd(), uri);

    path.exists(filename, function(exists) {
        if(!exists) {
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("404 Not Found\n");
            response.end();
            return;
        }

        if (fs.statSync(filename).isDirectory()) filename += '/index.html';

        fs.readFile(filename, "binary", function(err, file) {
            if(err) {
                response.writeHead(500, {"Content-Type": "text/plain"});
                response.write(err + "\n");
                response.end();
                return;
            }

            response.writeHead(200);
            response.write(file, "binary");
            response.end();
        });
    });
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");