class Particle {

    constructor(x, y, r) {
        this.pos   = createVector(x, y);
        this.vel   = createVector(random(-3, 3), random(-5, 0));
        this.acc   = createVector(0, 0);
        this.r     = r ? r : 48;
        this.halfr = r / 2;
    }

    applyForce(force) {
        this.acc.add(force);
    }

    update() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.set(0, 0);
    }

    display() {
        noStroke();
        fill(colorAlpha('#ff8e8e', this.calcBallAlpha()));
        ellipse(this.pos.x, this.pos.y, this.r, this.r);
    }

    edges() {
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
    }
    
    calcBallAlpha() {
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
    }
    
    x() {
        return this.pos.x;
    }
    
    y() {
        return this.pos.y;
    }

}


let particles = [];
let particleLiving = [];

let w = window.innerWidth,
    h = window.innerHeight,
    d = 50;


function setup() {
    
}

var myCanvas;
var skipFlag = false;

$("a").each((index, a) => {
    a.onmouseover = (event) => {
        console.log("EVENT");
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
        }
    };
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

