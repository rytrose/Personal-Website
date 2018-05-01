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
    "A0": "Bd004B-EQ+Phat+Kick.wav",
    "A#0": "Bd006B-EQ+Phat+Kick.wav",
    "B0": "Bd040B-EQ+Phat+Kick.wav",
    "C1": "Hh014B-EQ+Phat+Hihat.wav",
    "C#1": "Hh021B-EQ+Phat+Hihat.wav",
    "D1": "Hh133BOEQ+Phat+OpnHh.wav",
    "D#1": "R%26B+Crash+A+01+-+Close.wav",
    "E1": "R%26B+Floor+Tom+A+02+-+Close.wav",
    "F1": "R%26B+Rack+Tom+A+01+-+Close.wav",
    "F#1": "R%26B+Ride+01+-+Close.wav",
    "G1": "R%26B+Splash+B+01+-+Close.wav",
    "G#1": "Sn024B-EQ+Phat+Snare.wav",
    "A1": "Sn189B-EQ+Phat+Snare.wav",
    "A#1": "Sn201BREQ+Phat+Rimshot.wav"
}, function() { loadStatus[0] = true; console.log("perc loaded") }, "https://s3.amazonaws.com/rytrose-personal-website/sounds/percussion/").toMaster();

// Bass Sampler
var bass = new Tone.Sampler({
    "A3": "VEC2+Bass+023+A.wav"
}, function() { loadStatus[1] = true; console.log("bass loaded") }, "https://s3.amazonaws.com/rytrose-personal-website/sounds/bass/").toMaster();

// Synth1 Sampler
var synth1 = new Tone.Sampler({
    "A4": "VEC2+Synths+001+A.wav"
}, function() { loadStatus[2] = true; console.log("synth1 loaded") }, "https://s3.amazonaws.com/rytrose-personal-website/sounds/synth1/").toMaster();

// Synth2 Sampler
var synth2 = new Tone.Sampler({
    "B4": "VEC2+Synths+051+H.wav"
}, function() { loadStatus[3] = true; console.log("synth2 loaded") }, "https://s3.amazonaws.com/rytrose-personal-website/sounds/synth2/").toMaster();

// FX Sampler
var fx = new Tone.Sampler({
    "A0": "VEC2+FX+008.wav",
    "A#0": "VEC2+FX+009.wav",
    "B0": "VEC2+FX+010.wav",
    "C1": "VEC2+FX+013.wav",
    "C#1": "VEC2+FX+015.wav",
    "D1": "VEC2+FX+016.wav",
    "D#1": "VEC2+FX+031.wav",
    "E1": "VEC2+FX+032.wav",
    "F1": "VEC2+FX+035.wav",
    "F#1": "VEC2+FX+036.wav",
    "G1": "VEC2+FX+038.wav"
}, function() { loadStatus[4] = true; console.log("fx loaded") }, "https://s3.amazonaws.com/rytrose-personal-website/sounds/fx/").toMaster();

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