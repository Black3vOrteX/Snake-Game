var canvas = document.getElementById("gameCanvas");

const size = 600;
canvas.width = size;
canvas.height = size;

var c = canvas.getContext("2d");

const unit = 30;

let score = 0;
const scoreIs = document.querySelector(".score .value");

let snakeCol = 10;
let snakeRow = 10;

let dx = 0;
let dy = 0;

let foodX;
let foodY;

const foodImg = new Image();
foodImg.src = "egg.png";

foodImg.onload = function () {
    placeFood();
};

document.addEventListener("keydown", function (e) {

    if (e.key === "ArrowUp") {
        dx = 0; dy = -1;
    }
    else if (e.key === "ArrowDown") {
        dx = 0; dy = 1;
    }
    else if (e.key === "ArrowLeft") {
        dx = -1; dy = 0;
    }
    else if (e.key === "ArrowRight") {
        dx = 1; dy = 0;
    }
});


function placeFood() {
    foodX = Math.floor(Math.random() * 20) * unit;
    foodY = Math.floor(Math.random() * 20) * unit;
}

function drawFood() {
    c.drawImage(foodImg, foodX, foodY, unit, unit);
}

function gameloop() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 20; col++) {
            c.strokeRect(col * unit, row * unit, unit, unit);
        }
    }
    snakeCol += dx;
    snakeRow += dy;
    if (
        snakeCol < 0 || snakeCol > 19 ||snakeRow < 0 || snakeRow > 19
    ) {
        alert("Game Over");
        snakeCol = 10;
        snakeRow = 10;
        dx = 0;
        dy = 0;

        score = 0;
        scoreIs.textContent = score;

        placeFood();
        return;
    }

    
    if (
        snakeCol * unit === foodX &&snakeRow * unit === foodY) {
        score++;
        scoreIs.textContent = score;

        placeFood();
    }
    drawFood();
    c.fillStyle = "yellowgreen";
    c.fillRect(
        snakeCol * unit,snakeRow * unit,unit,unit);
}

setInterval(gameloop, 200);
