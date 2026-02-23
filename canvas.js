var canvas = document.getElementById("gameCanvas");
var header = document.getElementById("header");

function resizeCanvas(){
    var width = header.getBoundingClientRect().width;
    canvas.width=width;
    canvas.style.width=width + "px";
    canvas.height=window.innerHeight;
}
resizeCanvas();

var c = canvas.getContext("2d");
c.fillStyle = "blue";
c.fillRect(50,50,50,50);

c.moveTo(150,250);
c.lineTo(250,250);
c.lineTo(200,150);
c.closePath();
c.strokeStyle = "pink";
c.stroke();

console.log(canvas);