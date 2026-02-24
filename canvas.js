
var canvas = document.getElementById("gameCanvas");
var header = document.getElementById("header");

function resizeCanvas(){
    var width = header.getBoundingClientRect().width;
    canvas.width=width;
    canvas.style.width=width + "px";
    canvas.height=window.innerHeight;
}
resizeCanvas();

canvas.width=900;

var c = canvas.getContext("2d");
c.fillStyle = "pink";
c.fillRect(50,50,30,30);
c.fillRect(100,50,30,30);
c.fillRect(150,50,30,30);
c.fillRect(200,50,30,30);






console.log(canvas);