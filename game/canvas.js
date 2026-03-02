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
    restartGame();
});

// ================= GAME SETTINGS =================

const MAX_LENGTH = 15;
const SEGMENT_SPACING = 6;

let score = 0;
let timeLeft = 60;

let velocity = { x: 1, y: 0 }; // ✅ start moving right (fix reverse bug)
let baseSpeed = 4.5;
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

    for (let i = 0; i < targetLength * 6; i++) { // ✅ reduced density
        snake.push({
            x: centerX - i * SEGMENT_SPACING,
            y: centerY
        });
    }
}

resetSnake();
placeFood();

// ================= INPUT =================

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

function startTimerIfNeeded() {
    if (!gameStarted) {
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
    foodSpawnTime = Date.now(); // important
}

function drawFood() {
    let time = Date.now();

    let pulse = Math.sin(time * 0.008) * 6 + 14;
    let floatOffset = Math.sin(time * 0.0015) * 2;

    c.save();
    c.translate(food.x, food.y + floatOffset);

    // Soft outer glow (lighter for performance)
    c.beginPath();
    c.ellipse(0, 0, 14, 18, 0, 0, Math.PI * 2);
    c.fillStyle = currentFoodColor;
    c.globalAlpha = 0.2;
    c.shadowColor = currentFoodColor;
    c.shadowBlur = pulse;
    c.fill();

    c.globalAlpha = 1;

    // Main egg body
    c.beginPath();
    c.ellipse(0, 0, 10, 14, 0, 0, Math.PI * 2);

    let gradient = c.createRadialGradient(0, -4, 2, 0, 0, 14);
    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.4, currentFoodColor);
    gradient.addColorStop(1, currentFoodColor);

    c.fillStyle = gradient;
    c.shadowBlur = 0;
    c.fill();

    // Gloss highlight
    c.beginPath();
    c.ellipse(-3, -5, 3, 4, 0, 0, Math.PI * 2);
    c.fillStyle = "rgba(255,255,255,0.6)";
    c.fill();

    c.restore();
}

// ================= DRAW SNAKE =================

function drawSnake() {
    if (snake.length === 0) return;

    // ===== BODY =====
    c.beginPath();
    c.moveTo(snake[0].x, snake[0].y);

    for (let i = 1; i < snake.length - 2; i++) {
        const xc = (snake[i].x + snake[i + 1].x) / 2;
        const yc = (snake[i].y + snake[i + 1].y) / 2;
        c.quadraticCurveTo(snake[i].x, snake[i].y, xc, yc);
    }

    c.lineWidth = 14;

    let gradient = c.createLinearGradient(
        snake[0].x, snake[0].y,
        snake[snake.length - 1].x,
        snake[snake.length - 1].y
    );
    gradient.addColorStop(0, "#5eead4");
    gradient.addColorStop(1, "#00cc88");

    c.strokeStyle = gradient;
    c.shadowColor = "#5eead4";
    c.shadowBlur = 10;
    c.stroke();

    c.shadowBlur = 0;

    // ===== HEAD (ENHANCED) =====
    const head = snake[0];
    const time = Date.now();
    const breathe = Math.sin(time * 0.01) * 1.2 + 8;

    c.save();
    c.translate(head.x, head.y);

    // Outer glow pulse
    c.beginPath();
    c.arc(0, 0, breathe + 3, 0, Math.PI * 2);
    c.fillStyle = "#5eead4";
    c.globalAlpha = 0.15;
    c.shadowColor = "#5eead4";
    c.shadowBlur = 15;
    c.fill();

    c.globalAlpha = 1;
    c.shadowBlur = 0;

    // Main head body
    c.beginPath();
    c.arc(0, 0, breathe, 0, Math.PI * 2);

    let headGradient = c.createRadialGradient(0, -3, 2, 0, 0, breathe);
    headGradient.addColorStop(0, "#ffffff");
    headGradient.addColorStop(0.3, "#5eead4");
    headGradient.addColorStop(1, "#00cc88");

    c.fillStyle = headGradient;
    c.fill();

    // Subtle shine line
    c.beginPath();
    c.arc(0, -breathe / 2, breathe / 3, 0, Math.PI);
    c.strokeStyle = "rgba(255,255,255,0.3)";
    c.lineWidth = 2;
    c.stroke();

    c.restore();
}
// ================= GAME LOOP =================

function gameLoop() {
    if (!gameActive) return;

    c.clearRect(0, 0, size, size);

    let head = snake[0];
    let newHead = {
        x: head.x + velocity.x * currentSpeed,
        y: head.y + velocity.y * currentSpeed
    };

    snake.unshift(newHead);

    while (snake.length > targetLength * 6)
        snake.pop();

    // Wall collision
    if (
        newHead.x < 0 || newHead.x > size ||
        newHead.y < 0 || newHead.y > size
    ) {
        gameOver("collision");
        return;
    }

    // Food collision
    let dx = newHead.x - food.x;
    let dy = newHead.y - food.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 14) {
        if (targetLength < MAX_LENGTH)
            targetLength++;

        score++;
        feedCount++;
        scoreIs.textContent = score;

        if (feedCount % 5 === 0) {
            currentSpeed += 0.3;
            let colorIndex = Math.floor(feedCount / 5) % foodColors.length;
            currentFoodColor = foodColors[colorIndex];
        }

        placeFood();
    }
    if (Date.now() - foodSpawnTime >= FOOD_LIFETIME) {
    placeFood();
}

    drawFood();
    drawSnake();
}

// ================= GAME OVER =================

function gameOver(reason) {
    gameActive = false;
    clearInterval(timerInterval);

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

    velocity = { x: 1, y: 0 }; // reset right
    gameStarted = false;
    gameActive = true;

    resetSnake();
    placeFood();

    overlay.classList.remove("show");
    overlay.classList.add("hidden");
}

restartBtn.addEventListener("click", restartGame);

// ================= OPTIMIZED ANIMATION (30 FPS) =================

let lastTime = 0;
const fps = 30;
const interval = 1000 / fps;

function animate(time) {
    if (time - lastTime > interval) {
        gameLoop();
        lastTime = time;
    }
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);