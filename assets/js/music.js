// Get music state from session
window.state = JSON.parse($('#musicstate').val());

// Update the music state to the session
window.addEventListener("beforeunload", function (event) {
    // Update toggle status
    window.state["play"] = $('#musictoggle').prop('checked');
    // Update notes
    window.state["notes"] = notes;
    // Update sequencer
    window.state["matrix"] = sequencer.matrix.pattern;
    
    // Send the state
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
      if($(this).prop('checked')) Tone.Master.mute = false;
      else Tone.Master.mute = true;
})

// Music logic
var start = true;

// Perc Sampler
var perc = new Tone.Sampler({
    0: "Sn.wav"
}, () => { loadStatus[0] = true; console.log("perc loaded") }, "/test/").toMaster();

// Bass Sampler
var bass = new Tone.Sampler({
    "A3": "Bs.wav"
}, () => { loadStatus[1] = true; console.log("bass loaded") }, "/test/").toMaster();

// Synth1 Sampler
var synth1 = new Tone.Sampler({
    "A4": "A.wav"
}, () => { loadStatus[2] = true; console.log("synth1 loaded") }, "/test/").toMaster();

// Synth2 Sampler
var synth2 = new Tone.Sampler({
    "B4": "H.wav"
}, () => { loadStatus[3] = true; console.log("synth2 loaded") }, "/test/").toMaster();

// FX Sampler
var fx = new Tone.Sampler({
    0: "fx.wav"
}, () => { loadStatus[4] = true; console.log("fx loaded") }, "/test/").toMaster();

var loadStatus = [false, false, false, false, false];
var loaded = false;
var notes;
var sequencer;

$(function() {
    $('#musictoggle').prop('checked', window.state.play);
    $('#musictoggle').trigger('change');
    
    sequencer = new Nexus.Sequencer('#sequencer', {
        'size': [550, 180],
        'mode': 'toggle',
        'rows': 5,
        'columns': 16
    });
    sequencer.colorize("accent","#cce0ff");
    
    sequencer.on('step', function(v) {
        v.reverse();
        for(var i = 0; i < v.length; i++) {
            note = notes[sequencer.stepper.value][i];
            if(note != "") {
                if(v[i]) {
                    switch(i){
                        case 0:
                            perc.triggerAttack(note);
                            break;
                        case 1:
                            bass.triggerAttack(note);
                            break;
                        case 2:
                            synth1.triggerAttack(note);
                            break;
                        case 3:
                            synth2.triggerAttack(note);
                            break;
                        case 4:
                            fx.triggerAttack(note);
                            break;
                        default:
                            console.log("Bad row index.");
                    }
                }
            }
            else {
                if(v[i]) sequencer.matrix.set.cell(sequencer.stepper.value, i, 0);
            }
        }
    });
    
    notes = window.state.notes;
    if(!notes) {
        notes = Array(16);
        notes.fill(["", "", "", "", ""]);   
    }
    if(window.state.matrix) sequencer.matrix.set.all(window.state.matrix);
    
    var intervalFunc;
    intervalFunc = setInterval(function() {
        if(loadStatus.every(function(s){ return s; })) {
            sequencer.start(150);
            clearInterval(intervalFunc);
        }
    });
});