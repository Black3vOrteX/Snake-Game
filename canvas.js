var canvas = document.getElementById("gameCanvas");

let timeLeft = 60;
const timeDisplay = document.querySelector(".time .value");

let foodColor = "red";
let gameStarted = false;

const size = 600;
canvas.width = size;
canvas.height = size;

var c = canvas.getContext("2d");

const unit = 30;

// Score
let score = 0;
const scoreIs = document.querySelector(".score .value");

// Snake
let snake = [{ col: 10, row: 10 }];

// Direction
let dx = 0;
let dy = 0;

// Food
let foodX;
let foodY;

let speed = 200;
let gameInterval;
let timerInterval;

const MAX_LENGTH = 15;

document.addEventListener("keydown", function (e) {

    if (!gameStarted) {

        gameStarted = true;
        timerInterval = setInterval(updateTimer, 1000);
    }

    if (e.key === "ArrowUp" && dy !== 1) {
        dx = 0; dy = -1;
    }
    else if (e.key === "ArrowDown" && dy !== -1) {
        dx = 0; dy = 1;
    }
    else if (e.key === "ArrowLeft" && dx !== 1) {
        dx = -1; dy = 0;
    }
    else if (e.key === "ArrowRight" && dx !== -1) {
        dx = 1; dy = 0;
    }
});


// Place food
function placeFood() {
    foodX = Math.floor(Math.random() * 20) * unit;
    foodY = Math.floor(Math.random() * 20) * unit;
}


// Draw food
function drawFood() {
    c.fillStyle = foodColor;
    c.fillRect(foodX, foodY, unit, unit);
}


// Game Over
function gameOver() {

    alert("Game Over");

    // Reset snake
    snake = [{ col: 10, row: 10 }];
    dx = 0;
    dy = 0;

    // Reset score
    score = 0;
    scoreIs.textContent = score;

    // Reset speed
    speed = 200;

    gameStarted = false;
    clearInterval(gameInterval);
    gameInterval = setInterval(gameloop, speed);

    // Reset food
    foodColor = "red";
    placeFood();

    // Reset timer
    clearInterval(timerInterval);

    timeLeft = 60;
    timeDisplay.textContent = timeLeft;

    timerInterval = setInterval(updateTimer, 1000);
}


// Timer
function updateTimer() {

    timeLeft--;

    timeDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
        gameOver();
    }
}


// GAME LOOP
function gameloop() {

    // Clear
    c.clearRect(0, 0, canvas.width, canvas.height);

    // Grid
    for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 20; col++) {
            c.strokeRect(col * unit, row * unit, unit, unit);
        }
    }

    // New head
    const newHead = {
        col: snake[0].col + dx,
        row: snake[0].row + dy
    };

    snake.unshift(newHead);

    // Eat food
    if (
        newHead.col * unit === foodX &&
        newHead.row * unit === foodY
    ) {

        score++;
        scoreIs.textContent = score;

        // Speed up every 5
        if (score % 5 === 0 && speed > 60) {

            speed -= 20;

            clearInterval(gameInterval);
            gameInterval = setInterval(gameloop, speed);
        }

        // Change color every 5
        if (score % 5 === 0) {

            const colors = ["red", "orange", "yellow", "pink", "cyan"];

            foodColor = colors[(score / 5) % colors.length];
        }

        placeFood();

    } else {
        snake.pop();
    }

    // Max length
    if (snake.length > MAX_LENGTH) {
        snake.pop();
    }

    // Wall collision
    if (
        snake[0].col < 0 || snake[0].col > 19 ||
        snake[0].row < 0 || snake[0].row > 19
    ) {
        gameOver();
        return;
    }

    // Self collision
    for (let i = 1; i < snake.length; i++) {

        if (
            snake[0].col === snake[i].col &&
            snake[0].row === snake[i].row
        ) {
            gameOver();
            return;
        }
    }

    drawFood();

    for (let i = 0; i < snake.length; i++) {

        c.fillStyle = `hsl(120, 70%, ${50 - i}%)`;

        c.fillRect(
            snake[i].col * unit,
            snake[i].row * unit,
            unit,
            unit
        );
    }
}

placeFood();

gameInterval = setInterval(gameloop, speed);


      
    