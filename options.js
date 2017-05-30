// Saves options to chrome.storage
function save_options() {
  var option_values = {
    downscroll_opt: parseInt($('#downscroll').val()),
    prev_key_opt: parseInt($('.key-code[data-opt-name="prev-key"]').text()),
    next_key_opt: parseInt($('.key-code[data-opt-name="next-key"]').text()),
    alttext_key_opt: parseInt($('.key-code[data-opt-name="alttext-key"]').text()),
  };

  chrome.storage.sync.set(remove_falsy_values(option_values), function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      // TODO: prettify this div
      status.textContent = '';
    }, 750);
  });
}

// Restore form state using the preferences stored in chrome.storage.
function restore_options() {
  // TODO: make this command/these defaults common (for access from xkcd_binge.js)
  chrome.storage.sync.get({
      downscroll_opt: 75,
      prev_key_opt: 37,  // L arrow
      next_key_opt: 39, // R arrow
      alttext_key_opt: 32,  // spacebar
  }, function(items) {
    document.getElementById('downscroll').value = items.downscroll_opt;
    set_key_code_for_option(items.prev_key_opt, 'prev-key');
    set_key_code_for_option(items.next_key_opt, 'next-key');
    set_key_code_for_option(items.alttext_key_opt, 'alttext-key');
  });
}

function listen_for_key_code(event) {
  // maybe change CSS to indicate listening for keypress?
  console.log('you pressed:', event.keyCode);
  console.log(event.key);
  if (event.keyCode !== 27) {
    // Everything but 'esc' should set key_code for the option in question
    // ('esc' will ONLY execute the code outside this conditional, i.e. stop
    // listening for key presses).
    event.preventDefault();
    var key_code = event.keyCode;
    set_key_code_for_option(key_code, opt_name);
  }
  stop_listening_for_key_code();
}

function stop_listening_for_key_code() {
  $(document).unbind('keydown', listen_for_key_code);
  toggle_modal();
}

function set_key_code_for_option(code, opt_name) {
  // Set the code for "save" to pick up
  var key_code_elem = $('.key-code[data-opt-name="' + opt_name + '"]');
  key_code_elem.text(code);

  // and set the human-readable name
  var key_name_elem = $('.key-name[data-opt-name="' + opt_name + '"]');
  key_name_elem.text(key_code_map[code]);
}

function listen_for_key_code_for_option(event) {
  target = $(event.target);
  opt_name = target.attr('data-opt-name');
  console.log('gonna set key for option:', opt_name);
  $(document).bind('keydown', listen_for_key_code);

  // Set modal to show current option name, open modal
  human_readable_opt_name = target.attr('data-human-opt-name');
  $('#keypress-listen-modal #modal-opt-name').text(human_readable_opt_name);
  toggle_modal();
}

function restore_default_keycode(event) {
  target = $(event.target);
  opt_name = target.attr('data-opt-name');
  default_code = target.attr('data-default-val');
  set_key_code_for_option(default_code, opt_name);
}
// Add event listeners
document.addEventListener('DOMContentLoaded', restore_options);
$('#save').on('click', save_options);
$('.key-setter').each(function() {
  $(this).on('click', listen_for_key_code_for_option);
});
$('#keyboard-shortcuts .restore-default').each(function() {
  $(this).on('click', restore_default_keycode);
});

// Hardcoding way to restore downscroll setting for now, if I add other
// "other options" will need to make this programatic
$('#downscroll-restore-default').on('click', function() {
  $('#downscroll').val(75);
});

$('#close-modal').on('click', toggle_modal);

// Helper func.: removes all key/value pairs from given object where value is falsy.
function remove_falsy_values(obj) {
  var new_obj = {};
  for (var key in obj) {
    if (obj[key]) {
      new_obj[key] = obj[key];
    }
  }
  return new_obj;
}

// Given a jQuery elem., toggle display: block <--> none.
function toggle_display(elem) {
  if (elem.css('display') === 'none') {
    elem.css('display', 'block');
  } else {
    elem.css('display', 'none');
  }
}

function toggle_modal() {
  var modal = $('#keypress-listen-modal');
  toggle_display(modal);
}
