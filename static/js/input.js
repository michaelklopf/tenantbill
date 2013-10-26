// JS code
var boxIsChecked1 = { isChecked : false };
var boxIsChecked2 = { isChecked : false };
var daysInYear = 365;

// jQuery code
$(document).ready(function() {
    $('#dp1').datepicker({
      format: 'dd.mm.yyyy'
    });
    
    $('#dp2').datepicker({
      format: 'dd.mm.yyyy'
    });
    
    $('#check1').prop('checked', '');
    
    $('#sendbutton').click(function() {
        turnFieldsToNormal();
        if (areAllFieldsOk()) {
            turnFieldsToNormal();
            var data = createObject();
            postData(data);
        } else {
            return;
        }
    });
    
    $('#check1').change(function() {
        var date = $('#dp2').val();
        var year = '';
        if (date === '') {
            year = getYearOfPicker('#dp1');
        } else {
            year = parseInt(getYearOfDate(date)) - 1;
        }
        switchDpOnOff('#dp1', boxIsChecked1, year);
    });
    
    $('#check2').change(function() {
        var date = $('#dp1').val();
        var year = '';
        if (date === '') {
            year = getYearOfPicker('#dp2');
        } else {
            year = parseInt(getYearOfDate(date)) + 1;
        }
        switchDpOnOff('#dp2', boxIsChecked2, year);
    });
    
    var getYearOfPicker = function(datePickerElement) {
        var date = $(datePickerElement).data('datepicker').getDate();
        return date.getFullYear();
    }
    
    var switchDpOnOff = function(datePickerElement, boxIsChecked, year) {
        if (boxIsChecked.isChecked) {
            $(datePickerElement).datepicker({
                format: 'dd.mm.yyyy'
            });
            boxIsChecked.isChecked = false;
        } else {
            setFixedDate(datePickerElement, year);
            $(datePickerElement).datepicker('remove');
            boxIsChecked.isChecked = true;
        }
    }
    
    var setFixedDate = function(element, year) {
        var newDate = new Date(year, 00, 01);
        $(element).data('datepicker').setDate(newDate);
    }
    
    var createObject = function() {
        var data = new Object();
        data.date1 = $('#dp1').val();
        data.date2 = $('#dp2').val();
        if (boxIsChecked1.isChecked) {
            data.date1NewYear = true;
        } else {
            data.date1NewYear = false;
        }
        if (boxIsChecked2.isChecked) {
            data.date2NewYear = true;
        } else {
            data.date2NewYear = false;
        }
        if ($('#totalCost').val() === '') {
            data.totalCost = 0;
        } else {
            data.totalCost = $('#totalCost').val();
        }
        if ($('#prePay').val() === '') {
            data.prePay = 0;
        } else {
            data.prePay = $('#prePay').val();
        }
        if ($('#noCost').val() === '') {
            data.noCost = 0;
        } else {
            data.noCost = $('#noCost').val();
        }
        return data;
    }
    
    var postData = function(data) {
        var messageContent = JSON.stringify(data);
        $.ajax({
          url:"engage",
          type:"POST",
          data:messageContent,
          contentType:"application/json; charset=utf-8",
          dataType:"json",
          success: function(response){
            $('#contentarea').append(getResultText(response));
          }
        });
    }
    
    var getResultBar = function(result) {
        var barText = '<div class="progress">';
    }
    
    var getResultText = function(result) {
        var text = '<p class="result">The tenant lived <strong>' + result.partialYear + '</strong> days in the property.</p>';
        text = text + '<p class="result">The billable costs are <strong>' + result.finalCosts.toFixed(2) + '&euro;</strong>.</p>';
        if (result.remainingCosts > 0) {
            text = text + '<p class="result">The share is <strong>' + result.remainingCosts.toFixed(2) + '&euro;</strong> for the landlord.</p>';
        }
        text = text + '<p class="result">The tenant already paid <strong>' + result.partialPaymentsOfTenant.toFixed(2) + '&euro;</strong> of <strong>' + result.tenantCosts.toFixed(2) + '&euro;</strong>.</p>';
        text = text + '<p class="result">This leads to a remaining debt of <strong>' + result.remainingDebt.toFixed(2) + '&euro;</strong> the tenant has to pay back.</p>';
        return text;
    }
    
    var precise_round = function(num,decimals){
        return Math.round(num*Math.pow(10,decimals))/Math.pow(10,decimals);
    }
    
    var turnFieldsToNormal = function() {
        $('#contentarea').text('');
        removeHighlight('#dp1');
        removeHighlight('#dp2');
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
    
    var getDateInMs = function(date) {
        var day = getDayOfDate(date);
        var month = getMonthOfDate(date);
        var year = getYearOfDate(date);
        var dateObj = new Date(year, month-1, day);
        return Date.parse(dateObj);
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
    
    var areAllFieldsOk = function() {
        if(!isDateOk($('#dp1').val())) {
            alertMessage('#dp1', '', '');
            return false;
        }
        if (!isDateOk($('#dp2').val())) {
            alertMessage('', '#dp2', '');
            return false;
        }
        if (boxIsChecked1.isChecked) {
            if (!isNewYear($('#dp1').val())) {
                alertMessage('#dp1', '', 'Please enter 01.01.* for valid date.');
                return false;
            }
        }
        if (boxIsChecked2.isChecked) {
            if (!isNewYear($('#dp2').val())) {
                alertMessage('', '#dp2', 'Please enter 01.01.* for valid date.');
                return false;
            }
        }
        if (!areYearsDifferent($('#dp1').val(), $('#dp2').val())) {
            if (!boxIsChecked1.isChecked && !boxIsChecked2.isChecked) {
                alertMessage('#dp1', '', 'Dates need to be in the same year.');
                return false;
            }
        }
        if (!isTimeGapLessThanAYear($('#dp1').val(), $('#dp2').val())) {
            alertMessage('','', '');
            return false;
        }
        if (isStartDateBehindEndDate($('#dp1').val(), $('#dp2').val())) {
            alertMessage('#dp1', '#dp2','');
            return false;
        }
        return true;
    }
    
    var alertMessage = function(startDate, endDate, message) {
        if (startDate !== '' && endDate === '') {
            $('#contentarea').append('<div class="warning">Please check your start date again. ' + message + '</div>');
            setHighlightWithFocus('#dp1');
        } else if (startDate === '' && endDate !== '') {
            removeHighlight('#dp1');
            $('#contentarea').append('<div class="warning">Please check your end date again. ' + message + '</div>');
            setHighlightWithFocus('#dp2');
        } else if (startDate == '' && endDate == '') {
            removeHighlight('#dp1');
            removeHighlight('#dp2');
            $('#contentarea').append('<div class="warning">Please check your dates again. Must not be further apart than a year.</div>');
            setHighlightWithFocus('#dp1');
            setHighlightWithoutFocus('#dp2');
        } else {
            removeHighlight('#dp2');
            $('#contentarea').append('<div class="warning">Please check your start date again. Must be older than end date.</div>');
            setHighlightWithFocus('#dp1');
        }
    }
    
    var setHighlightWithFocus = function(element) {
        $(element).focus();
        $(element).css('outline-color', 'red');
    }
    
    var setHighlightWithoutFocus = function(element) {
        $(element).css('outline-color', 'red');
    }
    
    var removeHighlight = function(element) {
        $(element).css('outline-color', 'transparent');
    }
    
});

//Reminder

/*
    console.log($('#dp1').data('datepicker').setDate(newDate));
    var date = $(datePickerElement).data('datepicker').getDate();
    setFixedDate(datePickerElement, date.getFullYear());

    $(allcheckboxes).on(....
    function handleClick(cb) {
      display("Clicked, new value = " + cb.checked);
    }
*/
    
    /*
    var transformDate = function(date) {
        var day = getDayOfDate(date);
        var month = getMonthOfDate(date);
        var year = getYearOfDate(date);
        var result = '\'' + year + '-' + month + '-' + day +
            'T00:00:00Z\'';
        return result;
    }
    */