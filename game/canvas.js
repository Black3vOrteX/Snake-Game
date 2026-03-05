const canvas = document.getElementById("gameCanvas");
const c = canvas.getContext("2d");

const overlay = document.getElementById("gameOverOverlay");
const restartBtn = document.getElementById("restartBtn");
const overlayTitle = document.getElementById("overlayTitle");

const scoreIs = document.querySelector(".score .value");
const timeDisplay = document.querySelector(".time .value");

const introOverlay = document.getElementById("tinguIntro");
const startGameBtn = document.getElementById("startGameBtn");
startGameBtn.addEventListener("click", () => {
  introOverlay.style.display = "none";
  gameActive = true;
  restartGame(); 
});

overlay.classList.remove("show");
overlay.classList.add("hidden");
const SESSION_DURATION = 80;

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
let timeLeft = SESSION_DURATION;

let velocity = { x: 1, y: 0 };
let baseSpeed = 4.5;
let currentSpeed = baseSpeed;

let snake = [];
let targetLength = 5;

let food = { x: 0, y: 0 };
let foodColors = ["#ff4d4d", "#facc15", "#22c55e", "#3b82f6", "#a855f7"];
let currentFoodColor = foodColors[0];

let gameStarted = false;
let gameActive = false;
let timerInterval;

let foodSpawnTime = Date.now();

let highScore = Number(localStorage.getItem("snakeHighScore")) || 0;

// ================= INIT =================

function resetSnake() {
  snake = [];
  const centerX = size / 2;
  const centerY = size / 2;

  for (let i = 0; i < targetLength * 6; i++) {
    snake.push({
      x: centerX - i * SEGMENT_SPACING,
      y: centerY,
    });
  }
}

resetSnake();
placeFood();

// ================= DIFFICULTY SYSTEM =================

//function getFoodLifetime() {
//  if (score > 30) return 2500;
//  if (score > 25) return 3200;
// if (score >= 15) return 3800;
//  if (score >= 10) return 4500;
//  if (score >= 5) return 5500;
//  return 6500;
//}

//function updateDifficulty() {
//  if (score >= 30) {
//    currentSpeed = baseSpeed + 3.0;
//  } else if (score >= 20) {
//   currentSpeed = baseSpeed + 2.2;
//  } else if (score >= 15) {
//    currentSpeed = baseSpeed + 1.6;
//  } else if (score >= 10) {
//   currentSpeed = baseSpeed + 1.1;
//  } else if (score >= 5) {
//    currentSpeed = baseSpeed + 0.7;
//  } else {
//    currentSpeed = baseSpeed;
//  }
//}
function updateDifficulty() {
  currentSpeed = baseSpeed + score * 0.12;
}

function getFoodLifetime() {
  let lifetime = 7000 - score * 120;
  return Math.max(lifetime, 2000);
}

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

// ================= TIMER =================

function startTimerIfNeeded() {
  if (!gameStarted) {
    gameStarted = true;
    timerInterval = setInterval(updateTimer, 1000);
  }
}

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
  let safe = false;

  while (!safe) {
    food.x = Math.random() * (size - 40) + 20;
    food.y = Math.random() * (size - 40) + 20;

    safe = true;

    for (let segment of snake) {
      let dx = food.x - segment.x;
      let dy = food.y - segment.y;

      if (Math.sqrt(dx * dx + dy * dy) < 40) {
        safe = false;
        break;
      }
    }
  }

  foodSpawnTime = Date.now();
}

function drawFood() {
  let time = Date.now();
  let pulse = Math.sin(time * 0.008) * 6 + 14;
  let floatOffset = Math.sin(time * 0.0015) * 2;

  c.save();
  c.translate(food.x, food.y + floatOffset);

  c.beginPath();
  c.ellipse(0, 0, 14, 18, 0, 0, Math.PI * 2);
  c.fillStyle = currentFoodColor;
  c.globalAlpha = 0.2;
  c.shadowColor = currentFoodColor;
  c.shadowBlur = pulse;
  c.fill();

  c.globalAlpha = 1;

  c.beginPath();
  c.ellipse(0, 0, 10, 14, 0, 0, Math.PI * 2);

  let gradient = c.createRadialGradient(0, -4, 2, 0, 0, 14);
  gradient.addColorStop(0, "#ffffff");
  gradient.addColorStop(0.4, currentFoodColor);
  gradient.addColorStop(1, currentFoodColor);

  c.fillStyle = gradient;
  c.shadowBlur = 0;
  c.fill();

  c.beginPath();
  c.ellipse(-3, -5, 3, 4, 0, 0, Math.PI * 2);
  c.fillStyle = "rgba(255,255,255,0.6)";
  c.fill();

  c.restore();
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

  let gradient = c.createLinearGradient(
    snake[0].x,
    snake[0].y,
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

  const head = snake[0];
  const time = Date.now();
  const breathe = Math.sin(time * 0.01) * 1.2 + 8;

  c.save();
  c.translate(head.x, head.y);

  c.beginPath();
  c.arc(0, 0, breathe + 3, 0, Math.PI * 2);
  c.fillStyle = "#5eead4";
  c.globalAlpha = 0.15;
  c.shadowColor = "#5eead4";
  c.shadowBlur = 15;
  c.fill();

  c.globalAlpha = 1;
  c.shadowBlur = 0;

  c.beginPath();
  c.arc(0, 0, breathe, 0, Math.PI * 2);

  let headGradient = c.createRadialGradient(0, -3, 2, 0, 0, breathe);
  headGradient.addColorStop(0, "#ffffff");
  headGradient.addColorStop(0.3, "#5eead4");
  headGradient.addColorStop(1, "#00cc88");

  c.fillStyle = headGradient;
  c.fill();

  c.restore();
}

// ================= GAME LOOP =================

function gameLoop() {
  if (!gameActive) return;

  c.clearRect(0, 0, size, size);

  let head = snake[0];
  let newHead = {
    x: head.x + velocity.x * currentSpeed,
    y: head.y + velocity.y * currentSpeed,
  };

  snake.unshift(newHead);

  while (snake.length > targetLength * 6) snake.pop();
// Wall collision
  if (
    newHead.x < 0 ||
    newHead.x > size ||
    newHead.y < 0 ||
    newHead.y > size
  ) {
    gameOver("wall");
    return;
  }

  // Self collision
  for (let i = 10; i < snake.length; i++) {
    let dx = newHead.x - snake[i].x;
    let dy = newHead.y - snake[i].y;
    if (Math.sqrt(dx * dx + dy * dy) < 8) {
      gameOver("self");
      return;
    }
  }

  // Food collision
  let dx = newHead.x - food.x;
  let dy = newHead.y - food.y;

  if (Math.sqrt(dx * dx + dy * dy) < 14) {
    if (targetLength < MAX_LENGTH) targetLength++;

    score++;
    scoreIs.textContent = score;

    // Change color every 5 feeds
    
    let colorIndex = Math.floor((score - 1) / 5) % foodColors.length;
    currentFoodColor = foodColors[colorIndex];


updateDifficulty();
placeFood();
  }

  if (Date.now() - foodSpawnTime >= getFoodLifetime()) {
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

  localStorage.setItem("snakeLastScore", score);

localStorage.setItem(
  "snakeGamesPlayed",
  (Number(localStorage.getItem("snakeGamesPlayed")) || 0) + 1
);

localStorage.setItem(
  "snakeRoastCount",
  (Number(localStorage.getItem("snakeRoastCount")) || 0) + 1
);

  overlayTitle.textContent =
    reason === "time" ? "Time Up" : "Game Over";

  document.getElementById("finalScore").textContent = score;
  document.getElementById("finalHighScore").textContent = highScore;
  document.getElementById("tinguMessage").textContent =
    getTinguMessage(score, reason);
  overlay.classList.remove("hidden");
  overlay.classList.add("show");
}

// ================= TINGU ROAST =================
let lastTinguMessage = "";

function getTinguMessage(score, reason) {

  const messages = {
    zero: [
      "Start cheyyaledu kuda… warm up ani cheppava?",
      "0 aa? Even tutorial skip chesava?",
      "Nuvvu aadava… leda vibe check ki vachava?"
    ],

    low: [
      "Skill issue ra.",
      "Confidence ekkuva… reflex slow.",
      "Ila aadithe jungle lo internship kuda raadhu.",
      "One more try antaava? Sarey chuddam."
    ],

    mid: [
      "Okay okay… finally brain ON chesava?",
      "Konchem improve ayyaav… I’ll allow it.",
      "Not bad… but still beta version.",
      "Heat lo unnav… but not lava level."
    ],

    good: [
      "Ahh! Ippudu manchi form lo unnav.",
      "Respect konchem perigindi.",
      "Idhe maintain cheyyi… ego perigakunda.",
      "Now we’re talking ra."
    ],

    insane: [
      "Wah champion… ipudu nenu alert mode lo unna.",
      "Dangerous player vibes.",
      "Okay this was clean… I’m impressed.",
      "Nuvvu practice chesthunnaav ani ardham avthundi."
    ],

    wall: [
      "Wall ni blame chesthava ippudu?",
      "Map fixed… problem nuvve.",
      "Straight ga wall lo dive chesav ra."
    ],

    self: [
      "Self sabotage ante idi.",
      "Nuvve ninnu tinnesukunnaav.",
      "Inner demons win ayyaru."
    ]
  };

  function random(arr) {
    let msg;
    do {
      msg = arr[Math.floor(Math.random() * arr.length)];
    } while (msg === lastTinguMessage && arr.length > 1);

    lastTinguMessage = msg;
    return msg;
  }

  // Rare chaotic line (5%)
  if (Math.random() < 0.05) {
    return "Nee confidence ki separate leaderboard create cheyyali ra.";
  }

  if (reason === "wall") {
  return random(messages.wall);
}

if (reason === "self") {
  return random(messages.self);
}

  if (score === 0) return random(messages.zero);
  if (score < 5) return random(messages.low);
  if (score < 15) return random(messages.mid);
  if (score < 30) return random(messages.good);
  return random(messages.insane);
}
// ================= RESTART =================

function restartGame() {
  clearInterval(timerInterval);
  currentFoodColor = foodColors[0];
  score = 0;
  targetLength = 5;
  currentSpeed = baseSpeed;
  scoreIs.textContent = score;
  
  timeLeft = SESSION_DURATION;
  timeDisplay.textContent = SESSION_DURATION.toString().padStart(2, "0");

  velocity = { x: 1, y: 0 };
  gameStarted = false;
  gameActive = true;

  resetSnake();
  placeFood();

  lastTime = 0;

  overlay.classList.remove("show");
  overlay.classList.add("hidden");
}

restartBtn.addEventListener("click", restartGame);
document.getElementById("gameOverQuitBtn").addEventListener("click", () => {
  window.location.href = "../thankyou.html";
});
document.getElementById("gameOverQuitBtn").addEventListener("click", () => {
  window.location.href = "../thankyou.html";
});
document.getElementById("quitBtn").addEventListener("click", () => {
  window.location.href = "../thankyou.html";
});

// ================= ANIMATION =================



let lastTime = 0;
const fps = 30;
const interval = 1000 / fps;

function animate(time) {
  if (time - lastTime > interval) {
    if (gameActive) {
      gameLoop();
    }
    lastTime = time;
  }

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

// ================= MOBILE BUTTON CONTROLS =================

const upBtn = document.getElementById("upBtn");
const downBtn = document.getElementById("downBtn");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

function handleDirection(newVelocity) {
  if (!gameActive) return;

  // Prevent reversing
  if (
    (newVelocity.x === -velocity.x && newVelocity.x !== 0) ||
    (newVelocity.y === -velocity.y && newVelocity.y !== 0)
  ) {
    return;
  }

  velocity = newVelocity;
  startTimerIfNeeded();
}

function addMobileControl(button, direction) {
  if (!button) return;

  button.addEventListener("touchstart", (e) => {
    e.preventDefault();
    handleDirection(direction);
  });

  button.addEventListener("click", () => {
    handleDirection(direction);
  });
}

addMobileControl(upBtn, { x: 0, y: -1 });
addMobileControl(downBtn, { x: 0, y: 1 });
addMobileControl(leftBtn, { x: -1, y: 0 });
addMobileControl(rightBtn, { x: 1, y: 0 });



// ================= INTRO OVERLAY =================

const introLines = [
  "hi",
  "nenu tingu",
  "naku akali ekkuvoy",
  "naku ekkuva gudlu pettali",
  "lekapote…",
  "vacche nagulachavithiki chusukundam."
];

const tinguText = document.getElementById("tinguText");
const tinguSnake = document.getElementById("tinguSnake");

function playIntro() {
  tinguText.innerHTML = "";
  startGameBtn.style.opacity = "0";
  tinguSnake.style.opacity = "0";
  tinguSnake.style.transform = "translateX(-150px)";

  let lineIndex = 0;

  function typeCurrentLine() {
    if (lineIndex >= introLines.length) {
      startGameBtn.style.opacity = "1";
      return;
    }

    let text = introLines[lineIndex];
    let charIndex = 0;

    function typeChar() {
      if (charIndex < text.length) {
        tinguText.innerHTML += text[charIndex];
        charIndex++;
        setTimeout(typeChar, 40);
      } else {
        tinguText.innerHTML += "<br>";

        if (text === "nenu tingu") {
          tinguSnake.style.opacity = "1";
          tinguSnake.style.transform = "translateX(0)";

          setTimeout(() => {
            tinguSnake.style.animation =
              "wiggle 1s ease-in-out infinite alternate";
          }, 600);
        }

        lineIndex++;
        setTimeout(typeCurrentLine, 400);
      }
    }

    typeChar();
  }

  typeCurrentLine();
}

playIntro();