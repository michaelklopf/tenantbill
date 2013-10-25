var express = require('express');
var http = require('http');
var sys = require('util');
var rest = require('restler');
var fs = require('fs');

var app = express();

app.use(express.static(__dirname + '/static'));
app.use(express.bodyParser());

var daysInYear = 365;
var milliseconds_per_year = (60*60*24*1000*daysInYear);

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
        console.log("1");
        return false;
    }
    if (!isDateOk(data.date2)) {
        console.log("2");
        return false;
    }
    if (data.totalCost < 0) {
        console.log("3");
        return false;
    }
    if (data.prePay < 0) {
        console.log("4");
        return false;
    }
    if (data.noCost < 0) {
        console.log("5");
        return false;
    }
    if (data.date1NewYear === true) {
        if (!isNewYear(data.date1)) {
            console.log("6");
            return false;
        }
    }
    if (data.date2NewYear === true) {
        if (!isNewYear(data.date2)) {
            console.log("7");
            return false;
        }
    }
    if (!areYearsDifferent(data.date1, data.date2)) {
        if (!data.date1NewYear && !data.date2NewYear) {
            console.log("8");
            return false;
        }
    }
    if (!isTimeGapLessThanAYear(data.date1, data.date2)) {
        console.log("9");
        return false;
    }
    if (isStartDateBehindEndDate(data.date1, data.date2)) {
        console.log("10");
        return false;
    }
    return true;
}

var isDateOk = function(date) {
    var regex = /^\d{2}\.\d{2}\.\d{4}$/;
    return regex.test(date);    
}
    
var isNewYear = function(date) {
    var regex = /^01\.01\.\d{4}$/;
    return regex.test(date);    
}

var isStartDateBehindEndDate = function(startDate, endDate) {
    if (getYearOfDate(startDate) < getYearOfDate(endDate)) {
        return false;
    } else if (getYearOfDate(startDate) > getYearOfDate(endDate)) {
        return true;
    } else {
        if (getMonthOfDate(startDate) > getMonthOfDate(endDate)) {
            return true;
        } else if (getMonthOfDate(startDate) < getMonthOfDate(endDate)) {
            return false;
        } else {
            if (getDayOfDate(startDate) > getDayOfDate(endDate)) {
                return true;
            } else {
                return false;
            }
        }
    }
}

var isTimeGapLessThanAYear = function(startDate, endDate) {
    var start = getDateInMs(startDate);
    var end  = getDateInMs(endDate);
    var milliseconds_per_year = (60*60*24*1000*daysInYear);
    var timegap = end-start;
    var partialYear = Math.round(timegap/milliseconds_per_year*daysInYear);
    var numberOfDaysInYear = 0;
    if (isLeapYear(startDate)) {
        numberOfDaysInYear = 366;
    } else {
        numberOfDaysInYear = daysInYear;
    }
    if (partialYear <= numberOfDaysInYear) {
        return true;
    } else {
        return false;
    }
}

var areYearsDifferent = function(startDate, endDate) {
    var startYear = getYearOfDate(startDate);
    var endYear = getYearOfDate(endDate);
    if (startYear === endYear) {
        return true;
    } else {
        return false;
    }
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

var isLeapYear = function(date) {
    var year = getYearOfDate(date);
    if (year % 400 === 0) {
        return true;
    } else if (year % 100 === 0) {
        return false;
    } else if (year % 4 === 0) {
        return true;
    } else {
        return false;
    }
}

var computeBill = function(data) {
    var result = new Object();
    // change date format and parse date to milliseconds
    var date1 = getDateInMs(data.date1);
    var date2 = getDateInMs(data.date2);
    var timegap = date2-date1;
    
    var numberOfDaysInYear = 0;
    if (isLeapYear(data.date1)) {
        numberOfDaysInYear = 366;
    } else {
        numberOfDaysInYear = daysInYear;
    }
    
    var partialYear = Math.round(timegap/milliseconds_per_year*numberOfDaysInYear);
    var finalCosts = data.totalCost-data.noCost;
    var tenantCosts = finalCosts/numberOfDaysInYear * partialYear;
    var remainingCosts = finalCosts/numberOfDaysInYear * (numberOfDaysInYear-partialYear);
    var partialPaymentsOfTenant = data.prePay/numberOfDaysInYear * partialYear;
    var remainingDebt = tenantCosts-partialPaymentsOfTenant;
    
    result.partialYear = partialYear;
    result.finalCosts = finalCosts;
    result.tenantCosts = tenantCosts;
    result.remainingCosts = remainingCosts;
    result.partialPaymentsOfTenant = partialPaymentsOfTenant;
    result.remainingDebt = remainingDebt;
    return result;
}

var port = 3000;
http.createServer(app).listen(port, function() {
    console.log('Listening on port ' + port);
});