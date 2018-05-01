function Particle(x, y, r) {
        this.pos   = createVector(x, y);
        this.vel   = createVector(random(-3, 3), random(-5, 0));
        this.acc   = createVector(0, 0);
        this.r     = r ? r : 48;
        this.halfr = r / 2;
}

Particle.prototype.applyForce = function applyForce(force) {
    this.acc.add(force);
};

Particle.prototype.update = function update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
};

Particle.prototype.display = function display(){
    noStroke();
    fill(colorAlpha(pageToColor(), this.calcBallAlpha()));
    ellipse(this.pos.x, this.pos.y, this.r, this.r);
};

Particle.prototype.edges = function edges() {
    if(this.pos.y > (height - this.halfr)) {
        this.vel.y *= -1;
        this.pos.y = (height - this.halfr);
    }

    if(this.pos.y < 0 + this.halfr) {
        this.vel.y *= -1;
        this.pos.y = 0 + this.halfr;
    }

    if(this.pos.x > (width - this.halfr)) {
        this.vel.x *= -1;
        this.pos.x = (width - this.halfr);
    }

    if(this.pos.x < this.halfr) {
        this.vel.x /= -1;
        this.pos.x = this.halfr;
    }
};

Particle.prototype.calcBallAlpha = function calcBallAlpha() {
    var alpha = 1.0;
    if(this.pos.x <= (this.r * 4)) {
        var newAlpha = (this.pos.x - (this.r * 2)) / (this.r * 2);
        alpha = Math.min(alpha, newAlpha);
    }
    if(this.pos.x >= (width - (this.r * 4))) {
        var newAlpha = ((width - this.pos.x) - (this.r * 2)) / (this.r * 2);
        alpha = Math.min(alpha, newAlpha);
    }
    if(this.pos.y >= (height - (this.r * 4))) {
        var newAlpha = ((height - this.pos.y) - (this.r * 2)) / (this.r * 2);
        alpha = Math.min(alpha, newAlpha);
    }
    
    if(alpha < 0.0) return 0.0;
    else return alpha;
};

Particle.prototype.x = function x() {
    return this.pos.x;
};

Particle.prototype.y = function y() {
    return this.pos.y;
};


var particles = [];
var particleLiving = [];

var w = window.innerWidth,
    h = window.innerHeight,
    d = 50;


function setup() {
    
}

var myCanvas;

$("a").each(function(index, a) {
    if(a.id != "soundAnchor") {
        $(a).attr("myId", "anchor" + index);
    a.onmouseover = function(event) {
        if($('#musictoggle').prop('checked') && !skipFlag) {
            var canvasWidth = 230;
            var canvasHeight = 230;
            myCanvas = createCanvas(canvasWidth, canvasHeight);
            
            var a_width = $(a).width();
            var a_height = $(a).height();
            
            var centerX = $(a).position().left + a_width / 2;
            var centerY = $(a).position().top + a_height / 2;
            
            myCanvas.position(centerX - (canvasWidth / 2), centerY - (canvasHeight / 2));
            myCanvas.style('z-index', '-1');
            myCanvas.parent(a);
            
            var i = 0;
            
            // Start particles
            setInterval(function() {
              if(i <= 25) {
                  particles[i] = new Particle(width / 2, height / 2, random(3, 25));
                  particleLiving[i] = true;
                  i++;
              }
            }, 15);
            
            // Update sequencer file
            var myId = $(a).attr("myId");
            var anchorId = parseInt(myId.substr(6, myId.length));
            notes[(sequencer.stepper.value + 1) % (sequencer.stepper.max)][pageToRow()] = anchorIdToNote(anchorId);
            sequencer.matrix.set.cell((sequencer.stepper.value + 1) % (sequencer.stepper.max), pageToRow(), 1);
        }
    };   
    }
});

function draw() {
    background(0, 0, 0, 0);
    clear();

    var gravity = createVector(0, 0.15);
    var wind = createVector(0.09, 0);

    if(particles.length > 0) {
        for(var i = 0; i < particles.length; i++) {
            particles[i].update();
            if(particleLiving[i] && 
            ((particles[i].x() < 0 || particles[i].x() > width) || 
            (particles[i].y() < 0 || particles[i].y() > height))) particleLiving[i] = false;
            particles[i].applyForce(gravity);
            particles[i].display();
        }
    }
   
    if(particleLiving.length > 0 && particleLiving.every(function(b){
        return !b;
    })) {
        console.log("Animation done.");
        if(myCanvas) { 
            myCanvas.remove();
            myCanvas = null;
            particles = [];
            particleLiving = [];
        }
    }
}

function colorAlpha(aColor, alpha) {
  var c = color(aColor);
  return color('rgba(' +  [red(c), green(c), blue(c), alpha].join(',') + ')');
}

function pageToColor() {
    var loc = window.location.href.split('/')[3];
    var color;
    switch(loc) {
        case "":
            color = '#ff8e8e';
            break;
        case "bio":
            color = "#00a53f";
            break;
        case "arrangements":
            color = "#2c02ea";
            break;
        case "performances":
            color = "#ffe15b";
            break;
        case "projects":
            color = "#c40193";
            break;
        default:
            color = '#000000';
    }
    return color;
}

function pageToRow() {
    var loc = window.location.href.split('/')[3];
    var row;
    switch(loc) {
        case "":
            row = 0;
            break;
        case "bio":
            row = 1;
            break;
        case "arrangements":
            row = 2;
            break;
        case "performances":
            row = 3;
            break;
        case "projects":
            row = 4;
            break;
        default:
            row = 0;
    }
    return row;
}

function anchorIdToNote(anchorId) {
    var loc = window.location.href.split('/')[3];
    var note;
    switch(loc) {
        case "":
            var percNotes = ["A0", "A#0", "B0", "C1", "C#1", "D1", "D#1", "E1", "F1", "F#1", "G1", "G#1", "A1", "A#1"];
            note = percNotes[anchorId % percNotes.length];
            break;
        case "bio":
            var bassNotes = ["D3", "D#3", "E3", "F#3", "G3", "A3", "A#3", "C4"];
            note = bassNotes[anchorId % bassNotes.length];
            break;
        case "arrangements":
            var synth1Notes = ["G4", "A4", "A#4", "C5", "D5", "D#5", "F#5", "G5"];
            note = synth1Notes[anchorId % synth1Notes.length];
            break;
        case "performances":
            var synth2Notes = ["G4", "A4", "A#4", "C5", "D5", "D#5", "F#5", "G5"];
            note = synth2Notes[anchorId % synth2Notes.length];
            break;
        case "projects":
            var fxNotes = ["A0", "A#0", "B0", "C1", "C#1", "D1", "D#1", "E1", "F1", "F#1", "G1"];
            note = fxNotes[anchorId % fxNotes.length];
            break;
        default:
            var percNotes = ["A0", "A#0", "B0", "C1", "C#1", "D1", "D#1", "E1", "F1", "F#1", "G1", "G#1", "A1", "A#1"];
            note = percNotes[anchorId % percNotes.length];
    }
    
    return note;
}

