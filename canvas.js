var canvas = document.getElementById("gameCanvas");
var c = canvas.getContext("2d");

const size = 600;
canvas.width = size;
canvas.height = size;

const unit = 30;
const gridSize = 20;
const MAX_LENGTH = 15;

// ================= GAME STATE =================

let score = 0;
let speed = 200;
let timeLeft = 60;

let dx = 0;
let dy = 0;

let snake = [{ col: 10, row: 10 }];

let foodX;
let foodY;
let foodColor = "red";
let foodActive = true;

let gameStarted = false;

let gameInterval;
let timerInterval;

let foodSpawnTime = Date.now();
let foodLife = 5000; // 5 seconds in milliseconds

// ================= UI =================

const scoreIs = document.querySelector(".score .value");
const timeDisplay = document.querySelector(".time .value");

// ================= INPUT =================

document.addEventListener("keydown", function (e) {

    let moved = false;

    if (e.key === "ArrowUp" && dy !== 1) {
        dx = 0; dy = -1; moved = true;
    }
    else if (e.key === "ArrowDown" && dy !== -1) {
        dx = 0; dy = 1; moved = true;
    }
    else if (e.key === "ArrowLeft" && dx !== 1) {
        dx = -1; dy = 0; moved = true;
    }
    else if (e.key === "ArrowRight" && dx !== -1) {
        dx = 1; dy = 0; moved = true;
    }

    if (moved && !gameStarted) {
        gameStarted = true;
        timerInterval = setInterval(updateTimer, 1000);
    }
});

// ================= TOUCH CONTROLS =================

let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", function (e) {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
});

canvas.addEventListener("touchend", function (e) {

    const touch = e.changedTouches[0];
    const dxTouch = touch.clientX - touchStartX;
    const dyTouch = touch.clientY - touchStartY;
    const minSwipeDistance = 30;

    if (Math.abs(dxTouch) > Math.abs(dyTouch)) {
        if (Math.abs(dxTouch) < minSwipeDistance) return;

        if (dxTouch > 0 && dx !== -1) { dx = 1; dy = 0; }
        else if (dxTouch < 0 && dx !== 1) { dx = -1; dy = 0; }

    } else {
        if (Math.abs(dyTouch) < minSwipeDistance) return;

        if (dyTouch > 0 && dy !== -1) { dx = 0; dy = 1; }
        else if (dyTouch < 0 && dy !== 1) { dx = 0; dy = -1; }
    }

    if (!gameStarted) {
        gameStarted = true;
        timerInterval = setInterval(updateTimer, 1000);
    }
});

// ================= FOOD =================

function placeFood() {

    let validPosition = false;

    while (!validPosition) {

        let randomCol = Math.floor(Math.random() * gridSize);
        let randomRow = Math.floor(Math.random() * gridSize);

        validPosition = true;

        for (let i = 0; i < snake.length; i++) {
            if (
                snake[i].col === randomCol &&
                snake[i].row === randomRow
            ) {
                validPosition = false;
                break;
            }
        }

        if (validPosition) {
            foodX = randomCol * unit;
            foodY = randomRow * unit;
        }
    }

    foodSpawnTime = Date.now();
    foodActive = true;
}

function drawFood() {

    if (!foodActive) return;

    let pulse = Math.sin(Date.now() * 0.01) * 5 + 20;

    c.shadowColor = foodColor;
    c.shadowBlur = pulse;

    c.fillStyle = foodColor;
    c.fillRect(foodX, foodY, unit, unit);

    c.shadowBlur = 0;

    c.fillStyle = "white";
    c.fillRect(foodX + 8, foodY + 8, unit - 16, unit - 16);

    c.fillStyle = foodColor;
    c.fillRect(foodX + 13, foodY + 13, unit - 26, unit - 26);
}

// ================= TIMER =================

function updateTimer() {

    timeLeft--;

    if (timeLeft <= 0) {
        timeLeft = 0;
        timeDisplay.textContent = "00";
        clearInterval(timerInterval);
        gameOver();
        return;
    }

    timeDisplay.textContent =
        timeLeft.toString().padStart(2, "0");
}

// ================= GAME OVER =================

function gameOver() {

    alert("Game Over");

    snake = [{ col: 10, row: 10 }];
    dx = 0; dy = 0;

    score = 0;
    scoreIs.textContent = score;

    speed = 200;
    foodColor = "red";

    timeLeft = 60;
    timeDisplay.textContent = timeLeft;

    clearInterval(timerInterval);
    gameStarted = false;

    placeFood();

    clearInterval(gameInterval);
    gameInterval = setInterval(gameloop, speed);
}

// ================= GAME LOOP =================
function gameloop() {

    c.clearRect(0, 0, canvas.width, canvas.height);

    // ===== FOOD DECAY (LOCKED) =====
    if (foodActive && Date.now() - foodSpawnTime >= foodLife) {

        foodActive = false; // LOCK so it cannot trigger again

        setTimeout(() => {
            placeFood();
        }, 500);
    }

    // ===== SNAKE MOVEMENT =====
    if (dx !== 0 || dy !== 0) {

        const newHead = {
            col: snake[0].col + dx,
            row: snake[0].row + dy
        };

        snake.unshift(newHead);

        if (
            foodActive &&
            newHead.col * unit === foodX &&
            newHead.row * unit === foodY
        ) {

            score++;
            scoreIs.textContent = score;
            placeFood();

        } else {
            snake.pop();
        }
    }

    drawFood();

    // draw snake
    c.fillStyle = "#00ff88";
    c.shadowColor = "#00ff88";
    c.shadowBlur = 15;

    for (let i = 0; i < snake.length; i++) {
        c.fillRect(
            snake[i].col * unit,
            snake[i].row * unit,
            unit,
            unit
        );
    }

    c.shadowBlur = 0;
}
// ================= START =================

placeFood();
gameInterval = setInterval(gameloop, speed);