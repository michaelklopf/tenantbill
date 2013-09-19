#!/usr/bin/env node

var readline = require('readline');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var createDates = function(startDate, endDate) {
    startDate = new Date(startDate);
    endDate = new Date(endDate);
};

var checkDateAndTime = function(date) {
    // geht nicht: var regex = /\d{4}/;
    // ?: is a non capturing group
    // geht: var regex = /(?:^|\D)(\d{4})(?=\D|$)/;
    // geht: var regex = /^\d{4}$/;
    var regex = /^\d{4}\-\d{2}\-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
    return regex.test(date);
};

var checkDate = function(date) {
    var regex = /^\d{4}\-\d{2}\-\d{2}T$/;
    return regex.test(date);    
};

var executeComputation = function() {
    rl.setPrompt('BILLS> ');
    rl.prompt();
    console.log("Please enter the start date in form:" +
        "year-month-dayTh:m:sZ");
    rl.prompt();
    rl.on('line', function(line) {
        if (checkDateAndTime(line.trim())) {
            console.log("We set the date to " + line.trim());
        } else if (checkDate(line.trim())) {
            var result = line.trim()+"00:00:00Z"
            console.log("We set the date to " + result);
        } else {
            console.log("Please enter a valid date.");
        }
        rl.prompt();
    }).on('close', function() {
      console.log('Have a great day!');
      process.exit(0);
    });
};

executeComputation();