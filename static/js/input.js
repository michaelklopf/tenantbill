// jQuery code
$(document).ready(function() {
    $('#dp1').datepicker({
      format: 'dd.mm.yyyy'
    });
    
    $('#dp2').datepicker({
      format: 'dd.mm.yyyy'
    });
    
    $('#sendbutton').click(function() {
        if (areCheckFieldsOk()) {
            $('#contentarea').text('');
            var data = createObject();
        } else {
            return;
        }
    });
    
    var createObject = function() {
        var data = new Object();
        data.date1 = $('#dp1').val();
        data.date2 = $('#dp2').val();
        data.totalCost = $('#totalCost').val();
        data.prePay = $('#prePay').val();
        data.noCost = $('#noCost').val();
        return data;
    }
    
    var isCheckDateOk = function(date) {
        var regex = /^\d{2}\.\d{2}\.\d{4}$/;
        return regex.test(date);    
    }
    
    var areCheckFieldsOk = function() {
        console.log($('#dp1').val());
        console.log(isCheckDateOk($('#dp1').val()));
        if(!isCheckDateOk($('#dp1').val()) || !isCheckDateOk($('#dp2').val())) {
            alertMessage();
            return false;
        } else if {
            // TODO check the number fields and check the year between the dates
        }
        return true;
    }
    
    var alertMessage = function() {
        $('#contentarea').text('Please check your inputs again.');
        // TODO Make nice message and add red highlight to inputs
    }
    
});