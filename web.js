var express = require('express');
var http = require('http');
var sys = require('util');
var rest = require('restler');
var fs = require('fs');

var app = express();

app.use(express.static(__dirname + '/static'));
app.use(express.bodyParser());

var milliseconds_per_year = (60*60*24*1000*365);

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
    if (dataIsValid(req.body)) {
        var responseMessage = computeBill(req.body);
        res.send(200, JSON.stringify(responseMessage));
    } else {
        res.send(200, JSON.stringify("Data not valid."));
    }
});

var dataIsValid = function(data) {
    if (!isDateOk(data.date1)) {
        return false;
    } else if(!isDateOk(data.date2)) {
        return false;
    } else if(data.totalCost < 0) {
        return false;
    } else if(data.prePay < 0) {
        return false;
    } else if(data.noCost < 0) {
        return false;
    }
    return true;
}

var isDateOk = function(date) {
    var regex = /^\d{2}\.\d{2}\.\d{4}$/;
    return regex.test(date);    
}

var computeBill = function(data) {
    var result = new Object();
    // change date format and parse date to milliseconds
    var date1 = getDateInMs(data.date1);
    var date2 = getDateInMs(data.date2);
    var timegap = date2-date1;
    var partialYear = Math.round(timegap/milliseconds_per_year*365);
    var finalCosts = data.totalCost-data.noCost;
    var tenantCosts = finalCosts/365 * partialYear;
    var remainingCosts = finalCosts/365 * (365-partialYear);
    return result;
}

var getDateInMs = function(date) {
    var day = getDayOfDate(date);
    var month = getMonthOfDate(date);
    var year = getYearOfDate(date);
    var dateObj = new Date(year, month-1, day);
    return Date.parse(dateObj);
}

var getYearOfDate = function(date) {
    var regex = /\d{4}$/;
    return date.match(regex)[0];
}

var getMonthOfDate = function(date) {
    var regex = /.\d{2}./;
    var preMonth = date.match(regex)[0];
    var regexFinal = /\d{2}/;
    return preMonth.match(regexFinal)[0];
}

var getDayOfDate = function(date) {
    var regex = /^\d{2}/;
    return date.match(regex)[0];
}

var getMsInTimePeriod = function(days) {
    return 60*60*24*1000*days;
}

var port = 3000;
http.createServer(app).listen(port, function() {
    console.log('Listening on port ' + port);
});