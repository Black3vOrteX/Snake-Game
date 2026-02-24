
var canvas = document.getElementById("gameCanvas");
const size = 600;
canvas.width=size;
canvas.height=size;




var c = canvas.getContext("2d");
c.fillStyle = "pink";
c.fillRect(50,50,30,30);
c.strokeStyle = "black";
c.strokeRect(50,50,30,30);

var c = canvas.getContext("2d");
c.fillStyle = "pink";
c.fillRect(80,50,30,30);
c.strokeStyle = "black";
c.strokeRect(80,50,30,30);

var c = canvas.getContext("2d");
c.fillStyle = "pink";
c.fillRect(110,50,30,30);
c.strokeStyle = "black";
c.strokeRect(110,50,30,30);

var c = canvas.getContext("2d");
c.fillStyle = "pink";
c.fillRect(140,50,30,30);
c.strokeStyle = "black";
c.strokeRect(140,50,30,30);

console.log(canvas);