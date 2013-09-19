var express = require('express');
var http = require('http');

var app = express();

app.get('*', function(req, res) {
    res.contentType('text/html');
    res.send(200, 'We learn express');
});

var port = 3000;
http.createServer(app).listen(port, function() {
    console.log('Listening on port ' + port);
});