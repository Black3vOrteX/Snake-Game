
var canvas = document.getElementById("gameCanvas");
const size = 600;
canvas.width=size;
canvas.height=size;

var c = canvas.getContext("2d");

c.fillStyle = "pink";
c.strokeStyle = "black";

const unit = 30;

let snakeCol = 10;
let snakeRow = 10;

let dx = 0; //change in x axis
let dy = 0; //change in y axis
document.addEventListener("keydown",function(e){

    if(e.key === "ArrowUp"){
        dx = 0;
        dy = -1;
    }
    else if(e.key === "ArrowDown"){
        dx = 0;
        dy = 1;
    }
    else if(e.key === "ArrowLeft"){
        dx = -1;
        dy = 0;
    }
    else if(e.key === "ArrowRight"){
        dx = 1;
        dy = 0;
    }
});

function gameloop(){
    c.clearRect(0,0,canvas.width,canvas.height);
    for(let row = 0; row < 20; row ++){
        for(let col = 0; col < 20; col++){
            c.strokeStyle = "black";
            c.strokeRect(col*unit,row*unit,unit,unit);
            if(snakeCol < 0 || snakeCol > 19 || snakeRow < 0 || snakeRow > 19){
    alert("Game Over");
    snakeCol = 10;
    snakeRow = 10;
}

        }
    }

snakeCol += dx;
snakeRow += dy;
c.fillStyle = "pink";
c.fillRect(snakeCol*unit,snakeRow*unit,unit,unit);
}
setInterval(gameloop,80);
if(snakeCol < 0 || snakeCol > 19 || snakeRow < 0 || snakeRow > 19){
    alert("Game Over");
    snakeCol = 10;
    snakeRow = 10;
}

console.log(canvas);