// Get music state from session
window.state = JSON.parse($('#musicstate').val());

// Update the music state to the session
window.addEventListener("beforeunload", function (event) {
  $('#musicstate').val(JSON.stringify(state));
  $.ajax({
      type: "POST",
      url: '/interactivemusic',
      data: $('#musicstateform').serialize(), 
      async: false
  });
});

// On sound toggle
$('#musictoggle').change(function() {
      if($(this).prop('checked')){}
})

// Music logic
Tone.Transport.start();