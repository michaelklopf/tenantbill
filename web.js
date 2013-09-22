var express = require('express');
var http = require('http');
var sys = require('util');
var rest = require('restler');
var fs = require('fs');

var app = express();

app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res) {
    var data = fs.readFileSync('index.html').toString();
    res.send(200, data);
    //res.contentType('text/html');
    //res.send(200, 'We learn express');
    /*
     rest.get('url').on('complete', function(response) {
        if (response instanceof Error) {
            sys.put('Error: ' + response.message);
        } else {
            sys.put(response);
        }
     });
    */
});

var port = 3000;
http.createServer(app).listen(port, function() {
    console.log('Listening on port ' + port);
});