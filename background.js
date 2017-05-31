var defaults_dict = {
    'downscroll_opt': 75,
    'prev_key_opt': 37,  // L arrow
    'next_key_opt': 39, // R arrow
    'alttext_key_opt': 32,  // spacebar
};

chrome.storage.sync.set({default_vals: defaults_dict});
