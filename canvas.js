var canvas = document.getElementById("gameCanvas");

let foodLife = 5;          // seconds before decay
let foodLifeLeft = 5;      
let foodDecayInterval;


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

    let moved = false;

    if (e.key === "ArrowUp" && dy !== 1) {
        dx = 0;
        dy = -1;
        moved = true;
    }
    else if (e.key === "ArrowDown" && dy !== -1) {
        dx = 0;
        dy = 1;
        moved = true;
    }
    else if (e.key === "ArrowLeft" && dx !== 1) {
        dx = -1;
        dy = 0;
        moved = true;
    }
    else if (e.key === "ArrowRight" && dx !== -1) {
        dx = 1;
        dy = 0;
        moved = true;
    }

    // Start timer only if sneke actually moves
    if (moved && !gameStarted) {
        gameStarted = true;
        timerInterval = setInterval(updateTimer, 1000);
    }
});

// Place food
function placeFood() {
    foodX = Math.floor(Math.random() * 20) * unit;
    foodY = Math.floor(Math.random() * 20) * unit;
    resetFoodLife();
}


// Draw food
function drawFood() {
   

    let x = foodX;
    let y = foodY;

    //pulse effect
    let pulse = Math.sin(Date.now() * 0.01) * 5 + 20;

    // outer glow
    c.shadowColor = foodColor;
    c.shadowBlur = pulse;

    c.fillStyle = foodColor;
    c.fillRect(x, y, unit, unit);

    // no glow for inner core
    c.shadowBlur = 0;

    // inner core
    c.fillStyle = "white";
    c.fillRect(x + 8, y + 8, unit - 16, unit - 16);

    c.fillStyle = foodColor;
    c.fillRect(x + 13, y + 13, unit - 26, unit - 26);
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

    clearInterval(foodDecayInterval);
}


// Timer
function updateTimer() {

    timeLeft--;

    if (timeLeft <= 0) {
        timeLeft = 0;
        timeDisplay.textContent = timeLeft.toString().padStart(2, "0");

        clearInterval(timerInterval);
        gameOver();
        return;
    }

    timeDisplay.textContent = timeLeft.toString().padStart(2, "0");
}


// GAME LOOP
function gameloop() {

    // Clear
    c.clearRect(0, 0, canvas.width, canvas.height);

    // Grid
    //for (let row = 0; row < 20; row++) {
    //    for (let col = 0; col < 20; col++) {
    //        c.strokeRect(col * unit, row * unit, unit, unit);
    //}
    //}
    

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

placeFood();

gameInterval = setInterval(gameloop, speed);

function updateFoodLife() {

    foodLifeLeft--;

    if (foodLifeLeft <= 0) {

        // Food expired
        placeFood();
        resetFoodLife();
    }
}

function resetFoodLife() {

    clearInterval(foodDecayInterval);

    foodLifeLeft = foodLife;

    foodDecayInterval = setInterval(updateFoodLife, 1000);
}



// perlin animation

const bgCanvas = document.getElementById("bgCanvas");
const bgCtx = bgCanvas.getContext("2d");

bgCanvas.width = 600;
bgCanvas.height = 600;

let t = 0;

function drawBackground() {

    let edgeDistance = Math.min(x, y, 600 - x, 600 - y);

if (edgeDistance < 35) {

    let value = noise.perlin3(x * 0.006, y * 0.006, t);

    let alpha = (value + 1) * 8;  // MUCH softer

    imageData.data[index] = 94;
    imageData.data[index + 1] = 234;
    imageData.data[index + 2] = 212;
    imageData.data[index + 3] = alpha;

} else {
    imageData.data[index + 3] = 0;
}
}

drawBackground();

      
    