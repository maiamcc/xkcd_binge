/*Special Thanks

 ...harris?

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

  function scroll_to_elem(elem) {
    // Given a jQuery elem., scroll to it.
    var bodyRect = document.body.getBoundingClientRect();
    var elemRect = elem[0].getBoundingClientRect();
    var v_offset = elemRect.top - bodyRect.top;

    window.scrollTo(0, v_offset);
  }

  chrome.extension.sendRequest({},function(response) {
    // Scroll to the comic
    scroll_to_elem($('#middleContainer'));
    console.log('woopwoop');
    // Modal for alt text
    var alt_text = $('#comic img').attr('title');
    var modal_html = `
      <div id="myModal" class="modal">
        <div class="modal-content">
          <span class="close">&times;</span>
          <p id="alt-text-goes-here"></p>
        </div>
      </div>
    `;
    var modal = $(modal_html);
    modal.find('#alt-text-goes-here').text(alt_text);
    $('#middleContainer').append(modal);

    // "L"/"R" navigates prev./next, "c" shows/hides alt-text modal
    var prev = document.querySelector('a[rel="prev"]');
    var next = document.querySelector('a[rel="next"]');
    
    $(document).keydown(function(event) {
      if (event.keyCode === 37) {
        // L arrow key (prev. comic)
        prev.click();
      } else if (event.keyCode === 39) {
        // R arror key (next comic)
        next.click();
      } else if (event.keyCode === 40) {
        // Increase scroll speed of down arrow
        event.preventDefault();
        window.scrollBy(0, 75);
      } else if (event.keyCode === 32) {
        // Spacebar (show/hide alt-text modal)
        event.preventDefault();
        toggle_display(modal);
      }
    });
  });
});
