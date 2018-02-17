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
      if(start) {
        Tone.Transport.start();
        bassPart.start(0);
        start = false;
      }
      if($(this).prop('checked')) Tone.Master.mute = false;
      else Tone.Master.mute = true;
})

// Music logic
var start = true;

var bass = new Tone.MonoSynth({
			"volume" : -10,
			"envelope" : {
				"attack" : 0.2,
				"decay" : 0.3,
				"release" : 2,
			},
			"filterEnvelope" : {
				"attack" : 0.001,
				"decay" : 0.01,
				"sustain" : 0.5,
				"baseFrequency" : 200,
				"octaves" : 2.6
			}
}).toMaster()

var bassPart = new Tone.Sequence(function(time, note){
	bass.triggerAttackRelease(note, "16n", time);
}, ["C2", ["C3", ["C3", "D2"]], "E2", ["D2", "A1"], "G1"]);