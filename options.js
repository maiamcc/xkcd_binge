// We're get these from chrome.storage on page load
var defaults = {};

// Saves options to chrome.storage (optional: pass status msg to display on save)
function save_options_with_msg(msg) {
  var option_values = {
    downscroll_opt: parseInt($('#downscroll').val()),
    prev_key_opt: parseInt($('.key-code[data-opt-name="prev_key"]').text()),
    next_key_opt: parseInt($('.key-code[data-opt-name="next_key"]').text()),
    alttext_key_opt: parseInt($('.key-code[data-opt-name="alttext_key"]').text()),
  };

  chrome.storage.sync.set(remove_falsy_values(option_values), function() {
    // Update status to let user know options were saved.
    show_status_msg(msg);
  });
}

function save_options_with_default_msg() {
  save_options_with_msg('Options saved!');
}

// Briefly sets contents of "status" elem., then clear it.
function show_status_msg(msg) {
  var status_elem = $('#status');
    status_elem.text(msg);
    setTimeout(function() {
      // And clear the status message.
      status_elem.text('');
    }, 1000);
}

// Restore form state using the preferences stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    default_vals: false
  }, function(res) {
    if (res.default_vals === false) {
      throw 'No default values saved to storage -- is background.js running?';
    }
    defaults = res.default_vals;

    // Get the options saved by the user (using the default values if nothing
    // comes back)
    chrome.storage.sync.get({
        downscroll_opt: defaults.downscroll_opt, // 75px
        prev_key_opt: defaults.prev_key_opt,  // L arrow
        next_key_opt: defaults.next_key_opt, // R arrow
        alttext_key_opt: defaults.alttext_key_opt,  // spacebar
    }, function(items) {
      set_key_code_for_option(items.prev_key_opt, 'prev_key');
      set_key_code_for_option(items.next_key_opt, 'next_key');
      set_key_code_for_option(items.alttext_key_opt, 'alttext_key');
      $('#downscroll').val(items.downscroll_opt);
    });
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
  set_key_code_for_option(defaults[opt_name+'_opt'], opt_name);
}

function restore_all_defaults() {
  set_key_code_for_option(defaults.prev_key_opt, 'prev_key');
  set_key_code_for_option(defaults.next_key_opt, 'next_key');
  set_key_code_for_option(defaults.alttext_key_opt, 'alttext_key');
  $('#downscroll').val(defaults.downscroll_opt);
  save_options_with_msg('Defaults restored!');
}

// Add event listeners
document.addEventListener('DOMContentLoaded', restore_options);
$('#save').on('click', save_options_with_default_msg);
$('.key-setter').each(function() {
  $(this).on('click', listen_for_key_code_for_option);
});
$('#keyboard-shortcuts .restore-default').each(function() {
  $(this).on('click', restore_default_keycode);
});

// Hardcoding way to restore downscroll setting for now, if I add other
// "other options" will need to make this programatic
$('#downscroll-restore-default').on('click', function() {
  $('#downscroll').val(defaults.downscroll_opt);
});
$('#restore-all').on('click', restore_all_defaults);

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
