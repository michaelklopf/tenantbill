// jQuery code
$(document).ready(function() {
    $('#dp1').datepicker({
      format: 'dd.mm.yyyy'
    });
    
    $('#dp2').datepicker({
      format: 'dd.mm.yyyy'
    });
    
    $('#sendbutton').click(function() {
        var data = new Object();
        data.date1 = $('#dp1').val();
        data.date2 = $('#dp2').val();
        data.totalCost = $('#totalCost').val();
        data.prePay = $('#prePay').val();
        data.noCost = $('#noCost').val();
        console.log(data);
    });
    
});