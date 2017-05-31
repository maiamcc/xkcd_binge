/*
  Special Thanks: ... harris?

  TODO: 'random' hotkey
*/

$(function() {
  // Given a jQuery elem., toggle display: block <--> none.
  function toggle_display(elem) {
    if (elem.css('display') === 'none') {
      elem.css('display', 'block');
    } else {
      elem.css('display', 'none');
    }
  }

  function toggle_modal() {
    var modal = $('#alttext-modal');
    toggle_display(modal);
  }


  $('#close-modal').on('click', toggle_modal);

  function scroll_to_elem(elem) {
    // Given a jQuery elem., scroll to it.
    var bodyRect = document.body.getBoundingClientRect();
    var elemRect = elem[0].getBoundingClientRect();
    var v_offset = elemRect.top - bodyRect.top;

    window.scrollTo(0, v_offset);
  }

  chrome.extension.sendRequest({},function(response) {
    var downscroll;
    var prev_key;
    var next_key;
    var alttext_key;

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
          downscroll_opt: defaults.downscroll_opt, // 75 px
          prev_key_opt: defaults.prev_key_opt,  // L arrow
          next_key_opt: defaults.next_key_opt, // R arrow
          alttext_key_opt: defaults.alttext_key_opt,  // spacebar
      }, function(items) {
        console.log(items);

        downscroll = items.downscroll_opt;
        prev_key = items.prev_key_opt;
        next_key = items.next_key_opt;
        alttext_key = items.alttext_key_opt;
      });
    });


    // Scroll to the comic
    scroll_to_elem($('#middleContainer'));

    // Create modal for alt text (hidden)
    var alt_text = $('#comic img').attr('title');
    var modal_html = `
      <div id="alttext-modal" class="modal">
        <div class="modal-content">
          <span id="close-modal">&times;</span>
          <p id="alt-text-goes-here"></p>
        </div>
      </div>
    `;
    var modal = $(modal_html);
    modal.find('#alt-text-goes-here').text(alt_text);
    $('#middleContainer').append(modal);
    $('#close-modal').on('click', toggle_modal);

    var prev = document.querySelector('a[rel="prev"]');
    var next = document.querySelector('a[rel="next"]');

    $(document).keydown(function(event) {
      if (event.keyCode === prev_key) {  // default: L arrow key (keyCode: 37)
        // Navigate to previous comic
        prev.click();
      } else if (event.keyCode === next_key) {  // default: R arrow key (keyCode: 39)
        // Navigate to next comic
        next.click();
      } else if (event.keyCode === alttext_key) {  // default: spacebar (keyCode: 32)
        // Show/hide alt-text modal
        event.preventDefault();
        toggle_modal();
      } else if (event.keyCode === 40) {
        // Increase scroll speed of down arrow
        // TODO: let user pick a fast-scroll key other than down arrow?
        event.preventDefault();
        window.scrollBy(0, downscroll);
      }
    });
  });
});
