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
    
    var turnFieldsToNormal = function() {
        $('#contentarea').text('');
        $('#dp1').css('color', 'black');
        $('#dp2').css('color', 'black');
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
        } else if (getDayOfDate(startDate) > getDayOfDate(endDate)) {
            return true;
        } else {
            return false;
        }
    }
    
    var areAllFieldsOk = function() {
        if(!isDateOk($('#dp1').val())) {
            alertMessage('#dp1', '');
            return false;
        }
        if (!isDateOk($('#dp2').val())) {
            alertMessage('', '#dp2');
            return false;
        }
        if (isStartDateBehindEndDate($('#dp1').val(), $('#dp2').val())) {
            alertMessage('#dp1', '#dp2');
            return false;
        }
        return true;
    }
    
    var alertMessage = function(startDate, endDate) {
        if (endDate === '') {
            //$(startDate).css('color', 'red');
            $('#contentarea').append('<br>Please check your start date again.');
        } else if (startDate === '') {
            //$(endDate).css('color', 'red');
            $('#contentarea').append('<br>Please check your end date again.');
        } else {
            //$(startDate).css('color', 'red');
            $('#contentarea').append('<br>Please check your start date again. Must be older than end date.');
        }
        // TODO Add red highlight to inputs
    }
    
});