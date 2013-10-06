var express = require('express');
var http = require('http');
var sys = require('util');
var rest = require('restler');
var fs = require('fs');

var app = express();

app.use(express.static(__dirname + '/static'));
app.use(express.bodyParser());

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

app.post('/engage', function(req, res) {
    //sys.put('Content');
    console.log(req.body.date1);
    console.log(req.body.date2);
    res.send(200, JSON.stringify({"Answer":"Request Received."}));
});

var port = 3000;
http.createServer(app).listen(port, function() {
    console.log('Listening on port ' + port);
});