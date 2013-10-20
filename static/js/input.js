// jQuery code
$(document).ready(function() {
    $('#dp1').datepicker({
      format: 'dd.mm.yyyy'
    });
    
    $('#dp2').datepicker({
      format: 'dd.mm.yyyy'
    });
    
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
    
    var createObject = function() {
        var data = new Object();
        data.date1 = $('#dp1').val();
        data.date2 = $('#dp2').val();
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
            $('#contentarea').append("It worked.");
            console.log(response);
          }
        });
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
    
    var isStartDateBehindEndDate = function(startDate, endDate) {
        if (getYearOfDate(startDate) > getYearOfDate(endDate)) {
            return true;
        } else if (getMonthOfDate(startDate) > getMonthOfDate(endDate)) {
            return true;
        } else if (getMonthOfDate(startDate) == getMonthOfDate(endDate) &&
                getDayOfDate(startDate) > getDayOfDate(endDate)) {
            return true;
        } else {
            return false;
        }
    }
    
    var isTimeGapLessThanAYear = function(startDate, endDate) {
        var start = getDateInMs(startDate);
        var end  = getDateInMs(endDate);
        var milliseconds_per_year = (60*60*24*1000*365);
        var timegap = end-start;
        var partialYear = Math.round(timegap/milliseconds_per_year*365);
        console.log("timegap " + timegap + " and partial Year " + partialYear);
        if (partialYear <= 365) {
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
    
    var areAllFieldsOk = function() {
        if(!isDateOk($('#dp1').val())) {
            alertMessage('#dp1', '');
            return false;
        }
        if (!isDateOk($('#dp2').val())) {
            alertMessage('', '#dp2');
            return false;
        }
        if (!isTimeGapLessThanAYear($('#dp1').val(), $('#dp2').val())) {
            alertMessage('','');
            return false;
        }
        if (isStartDateBehindEndDate($('#dp1').val(), $('#dp2').val())) {
            alertMessage('#dp1', '#dp2');
            return false;
        }
        return true;
    }
    
    var alertMessage = function(startDate, endDate) {
        if (startDate !== '' && endDate === '') {
            $('#contentarea').append('<div class="warning">Please check your start date again.</div>');
            setHighlightWithFocus('#dp1');
        } else if (startDate === '' && endDate !== '') {
            removeHighlight('#dp1');
            $('#contentarea').append('<div class="warning">Please check your end date again.</div>');
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