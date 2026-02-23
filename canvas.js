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
c.fillStyle = "lightseagreen";
c.fillRect(50,50,50,50);
console.log(canvas);