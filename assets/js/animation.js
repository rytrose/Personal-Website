var width;
var height;

function setup() {
    
}

$("a").each((index, a) => {
    a.onmouseover = (event) => {
        console.log("LINKKKK", event, a);
        var myCanvas = createCanvas(100, 100);
        myCanvas.position($(a).position().left, $(a).position().top);
        myCanvas.style('z-index', '999');
        myCanvas.parent(a);
    };
});

function draw() {
    background(220, 180, 200);
}
