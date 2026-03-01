const canvas = document.getElementById("gameCanvas");
const c = canvas.getContext("2d");

const overlay = document.getElementById("gameOverOverlay");
const restartBtn = document.getElementById("restartBtn");
const overlayTitle = document.getElementById("overlayTitle");

const scoreIs = document.querySelector(".score .value");
const timeDisplay = document.querySelector(".time .value");

// ================= RESPONSIVE SIZE =================

let size;

function resizeCanvas() {
    const wrapper = document.querySelector(".canvas-wrapper");
    size = wrapper.clientWidth;

    canvas.width = size;
    canvas.height = size;
}

resizeCanvas();
window.addEventListener("resize", () => {
    resizeCanvas();
    resetSnake();
    placeFood();
});

// ================= GAME SETTINGS =================

const MAX_LENGTH = 15;
const SEGMENT_SPACING = 6;

let score = 0;
let timeLeft = 60;

let velocity = { x: 0, y: 0 };
let baseSpeed = 2;
let currentSpeed = baseSpeed;

let snake = [];
let targetLength = 5;
let feedCount = 0;

let food = { x: 0, y: 0 };
let foodColors = ["#ff4d4d", "#facc15", "#22c55e", "#3b82f6", "#a855f7"];
let currentFoodColor = foodColors[0];

let gameStarted = false;
let gameActive = true;
let timerInterval;

let foodSpawnTime = Date.now();
const FOOD_LIFETIME = 5000;

let highScore = Number(localStorage.getItem("snakeHighScore")) || 0;

// ================= INIT =================

function resetSnake() {
    snake = [];

    const centerX = size / 2;
    const centerY = size / 2;

    for (let i = 0; i < targetLength * 10; i++) {
        snake.push({
            x: centerX - i * SEGMENT_SPACING,
            y: centerY
        });
    }
}

resetSnake();

// ================= INPUT =================

// Keyboard
document.addEventListener("keydown", (e) => {
    if (!gameActive) return;

    if (e.key === "ArrowUp" && velocity.y === 0)
        velocity = { x: 0, y: -1 };
    else if (e.key === "ArrowDown" && velocity.y === 0)
        velocity = { x: 0, y: 1 };
    else if (e.key === "ArrowLeft" && velocity.x === 0)
        velocity = { x: -1, y: 0 };
    else if (e.key === "ArrowRight" && velocity.x === 0)
        velocity = { x: 1, y: 0 };

    startTimerIfNeeded();
});

// Touch
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}, { passive: true });

canvas.addEventListener("touchend", (e) => {
    if (!gameActive) return;

    const touch = e.changedTouches[0];
    let dx = touch.clientX - touchStartX;
    let dy = touch.clientY - touchStartY;

    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0 && velocity.x === 0)
            velocity = { x: 1, y: 0 };
        else if (dx < 0 && velocity.x === 0)
            velocity = { x: -1, y: 0 };
    } else {
        if (dy > 0 && velocity.y === 0)
            velocity = { x: 0, y: 1 };
        else if (dy < 0 && velocity.y === 0)
            velocity = { x: 0, y: -1 };
    }

    startTimerIfNeeded();
}, { passive: true });

function startTimerIfNeeded() {
    if (!gameStarted && (velocity.x !== 0 || velocity.y !== 0)) {
        gameStarted = true;
        timerInterval = setInterval(updateTimer, 1000);
    }
}

// ================= TIMER =================

function updateTimer() {
    if (!gameActive) return;

    timeLeft--;
    timeDisplay.textContent = timeLeft.toString().padStart(2, "0");

    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        gameOver("time");
    }
}

// ================= FOOD =================

function placeFood() {
    food.x = Math.random() * (size - 40) + 20;
    food.y = Math.random() * (size - 40) + 20;
    foodSpawnTime = Date.now();
}

function drawFood() {
    let pulse = Math.sin(Date.now() * 0.01) * 6 + 12;

    c.save();
    c.translate(food.x, food.y);
    c.shadowColor = currentFoodColor;
    c.shadowBlur = pulse;

    c.beginPath();
    c.ellipse(0, 0, 10, 14, 0, 0, Math.PI * 2);
    c.fillStyle = currentFoodColor;
    c.fill();

    c.restore();
}

// ================= GAME LOOP =================

function gameLoop() {
    if (!gameActive) return;

    c.clearRect(0, 0, size, size);

    if (velocity.x === 0 && velocity.y === 0) {
        drawFood();
        drawSnake();
        return;
    }

    let head = snake[0];
    let newHead = {
        x: head.x + velocity.x * currentSpeed,
        y: head.y + velocity.y * currentSpeed
    };

    snake.unshift(newHead);

    while (snake.length > targetLength * 10)
        snake.pop();

    // Wall collision
    if (
        newHead.x < 0 || newHead.x > size ||
        newHead.y < 0 || newHead.y > size
    ) {
        gameOver("collision");
        return;
    }

    // Self collision
    for (let i = 20; i < snake.length; i++) {
        let dx = newHead.x - snake[i].x;
        let dy = newHead.y - snake[i].y;
        if (Math.sqrt(dx * dx + dy * dy) < 8) {
            gameOver("collision");
            return;
        }
    }

    // Food collision
    let dx = newHead.x - food.x;
    let dy = newHead.y - food.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 15) {
        if (targetLength < MAX_LENGTH)
            targetLength++;

        score++;
        feedCount++;
        scoreIs.textContent = score;

        if (feedCount % 5 === 0) {
            currentSpeed += 0.4;
            let colorIndex = Math.floor(feedCount / 5) % foodColors.length;
            currentFoodColor = foodColors[colorIndex];
        }

        placeFood();
    }

    if (Date.now() - foodSpawnTime > FOOD_LIFETIME)
        placeFood();

    drawFood();
    drawSnake();
}

// ================= DRAW SNAKE =================

function drawSnake() {
    if (snake.length === 0) return;

    c.beginPath();
    c.moveTo(snake[0].x, snake[0].y);

    for (let i = 1; i < snake.length - 2; i++) {
        const xc = (snake[i].x + snake[i + 1].x) / 2;
        const yc = (snake[i].y + snake[i + 1].y) / 2;
        c.quadraticCurveTo(snake[i].x, snake[i].y, xc, yc);
    }

    c.lineWidth = 14;
    c.strokeStyle = "#00cc88";
    c.stroke();

    c.beginPath();
    c.arc(snake[0].x, snake[0].y, 8, 0, Math.PI * 2);
    c.fillStyle = "#5eead4";
    c.fill();
}

// ================= GAME OVER =================

function gameOver(reason) {
    gameActive = false;
    clearInterval(timerInterval);
    gameStarted = false;

    if (score > highScore) {
        highScore = score;
        localStorage.setItem("snakeHighScore", highScore);
    }

    overlayTitle.textContent =
        reason === "time" ? "Time Up" : "Game Over";

    document.getElementById("finalScore").textContent = score;
    document.getElementById("finalHighScore").textContent = highScore;

    overlay.classList.remove("hidden");
    overlay.classList.add("show");
}

// ================= RESTART =================

function restartGame() {
    score = 0;
    targetLength = 5;
    feedCount = 0;
    currentSpeed = baseSpeed;
    currentFoodColor = foodColors[0];

    scoreIs.textContent = score;
    timeLeft = 60;
    timeDisplay.textContent = "60";

    velocity = { x: 0, y: 0 };

    resetSnake();
    placeFood();

    overlay.classList.remove("show");
    overlay.classList.add("hidden");

    gameStarted = false;
    gameActive = true;
}

placeFood();
restartBtn.addEventListener("click", restartGame);
setInterval(gameLoop, 16);