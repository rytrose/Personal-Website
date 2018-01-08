window.state = JSON.parse($('#musicstate').val());

window.addEventListener("beforeunload", function (event) {
  $('#musicstate').val(JSON.stringify(state));
  $.ajax({
      type: "POST",
      url: '/interactivemusic',
      data: $('#musicstateform').serialize(), 
      async: false
  });
});