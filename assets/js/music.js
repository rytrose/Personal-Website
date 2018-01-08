window.state = JSON.parse($('#musicstate').val());

window.addEventListener("beforeunload", function (event) {
  $('#musicstate').val(JSON.stringify(state));
//   $.post('/interactivemusic', $('#musicstateform').serialize(), {aync: false})
//   .always(function(){
//       console.log("SENT");
//   });
  $.ajax({
      type: "POST",
      url: '/interactivemusic',
      data: $('#musicstateform').serialize(), 
      async: false
  });
  console.log("Done");
});