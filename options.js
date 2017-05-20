// Saves options to chrome.storage
function save_options() {
  var opt_values = {
    downscroll_opt: document.getElementById('downscroll').value,
    prev_key_opt: document.getElementById('prev-key').value,
    next_key_opt: document.getElementById('next-key').value,
    alttext_key_opt: document.getElementById('alttext-key').value,
  };

  chrome.storage.sync.set(remove_falsy_values(opt_values), function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // TODO: make this command/these defaults common (for access from xkcd_binge.js)
  chrome.storage.sync.get({
      downscroll_opt: 75,
      prev_key_opt: 37,  // L arrow
      next_key_opt: 39, // R arrow
      alttext_key_opt: 32,  // spacebar
  }, function(items) {
    document.getElementById('downscroll').value = items.downscroll_opt;
    document.getElementById('prev-key').value = items.prev_key_opt;
    document.getElementById('next-key').value = items.next_key_opt;
    document.getElementById('alttext-key').value = items.alttext_key_opt;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);

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
