$(function() {
  // Pre-fill fields with current values of options
  // TODO!
  for(var i=1;i<=2;i++) {
    $('#opt' + i).attr('checked', localStorage['opt' + i] == 'true');
  }
  // $('#save').attr('disabled', 1);
  
  // $('.opt').change(function() {
  //   $('#save').removeAttr('disabled');
  //   $('#save').val('Save');
  // });
  
  $('#save').click(function() {
    // Save all values to local storage
    var options = $('.opt[type="text"]'); // for now, only saving contents of text inputs
    options.each(function() {
      val = $(this).val();
      if (val) {
        opt_id = $(this).attr('id');
        localStorage[opt_id] = val;
        console.log(opt_id, '-->', val);
      }
    });
    
    // $('#save').attr('disabled', 1);
    // $('#save').val('Saved');
  });
});