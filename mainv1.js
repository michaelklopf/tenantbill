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

var checkDate = function(date) {
    // geht nicht: var regex = /\d{4}/;
    // ?: is a non capturing group
    // geht: var regex = /(?:^|\D)(\d{4})(?=\D|$)/;
    // geht: var regex = /^\d{4}$/;
    var regex = /^\d{4}\-\d{2}\-\d{2}T\d{2}:\d{2}:\d{2}Z/;
    return regex.test(date);
};

var executeComputation = function() {
    rl.question("Please enter the start date in form:" +
     "year-month-dayTh:m:sZ\n", function(date) {
         if (checkDate(date)) {
             console.log("Thank you, for the correct start date.");
         } else {
             console.log("You typed in an invalid start date.")
         }
    });

    rl.question("Please enter the end date in form:" +
        "year-month-dayTh:m:sZ\n", function(date) {
        if (checkDate(date)) {
            console.log("Thank you, for the correct end date.");
        } else {
            console.log("You typed in an invalid start date.")
        }  
        rl.close();
    });
};

executeComputation();