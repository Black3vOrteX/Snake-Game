
var canvas = document.getElementById("gameCanvas");
const size = 600;
canvas.width=size;
canvas.height=size;




var c = canvas.getContext("2d");

c.fillStyle = "pink";
c.strokeStyle = "black";

const unit = 30;

for(let row=0;row<20;row++){
    for(let col=0;col<20;col++)
        {
         c.strokeStyle = "black";
        // c.fillRect(col*unit,row*unit,unit,unit);
        c.strokeRect(col*unit,row*unit,unit,unit);
    }
}









console.log(canvas);