var canvas = document.getElementById("gameCanvas");
let foodColor = "red";
const size = 600;
canvas.width = size;
canvas.height = size;

var c = canvas.getContext("2d");

const unit = 30;

let score = 0;
const scoreIs = document.querySelector(".score .value");

let snake = [{ col: 10, row: 10 }];

let dx = 0;
let dy = 0;

let foodX;
let foodY;



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
    c.fillStyle = foodColor;
    c.fillRect(foodX, foodY, unit, unit);   
}

function gameloop() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 20; col++) {
            c.strokeRect(col * unit, row * unit, unit, unit);
        }
    }


    const newHead = { col: snake[0].col + dx,
         row: snake[0].row + dy };
    snake.unshift(newHead);
    const maxlength = 15;
    
    if(snake.length > maxlength) {
        snake.pop();
    }
    
    if(newHead.col*unit === foodX  && newHead.row *unit=== foodY ) {
        score++;
        scoreIs.textContent = score;
        if(score % 5 === 0 && speed > 60) {
            speed -= 20;
            clearInterval(gameInterval);
            gameInterval = setInterval(gameloop, speed);
        }
        if(score % 5 === 0) {
            const colors = ["red", "orange", "yellow", "pink", "cyan"];
            foodColor = colors[(score / 5) % colors.length];
        }
        placeFood();
    }  else {    
        snake.pop();
    }
    
    
    if (
        snake[0].col < 0 || snake[0].col > 19 ||snake[0].row < 0 || snake[0].row > 19
    ) {
        alert("Game Over");
        snake[0].col = 10;
        snake[0].row = 10;
        dx = 0;
        dy = 0;

        score = 0;
        scoreIs.textContent = score;

        placeFood();
        return;
    }

    
    
    drawFood();
    for(let i= 0; i < snake.length; i++) {
    c.fillStyle = `hsl(120, 70%, ${50 - i}%)`;
       
    for(let part of snake) {
    c.fillRect(part.col * unit, part.row * unit, unit, unit);
}
}

}
let speed = 200;
let gameInterval = setInterval(gameloop, speed);
