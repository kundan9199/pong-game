const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 90;
const BALL_RADIUS = 10;
const PLAYER_X = 30;
const AI_X = canvas.width - 30 - PADDLE_WIDTH;
const PADDLE_SPEED = 6;

// Game state
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: 5 * (Math.random() > 0.5 ? 1 : -1),
    vy: 5 * (Math.random() * 2 - 1),
    speed: 6
};
let playerScore = 0;
let aiScore = 0;

// Draw paddles and ball
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawNet() {
    ctx.strokeStyle = "#555";
    ctx.lineWidth = 4;
    for (let i = 0; i < canvas.height; i += 32) {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, i);
        ctx.lineTo(canvas.width / 2, i + 16);
        ctx.stroke();
    }
}

function drawScore() {
    ctx.fillStyle = "#fff";
    ctx.font = "32px Arial";
    ctx.fillText(playerScore, canvas.width/4, 50);
    ctx.fillText(aiScore, canvas.width*3/4, 50);
}

// Main draw function
function draw() {
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawNet();
    drawScore();
    // Player paddle
    drawRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, "#00ff99");
    // AI paddle
    drawRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, "#ff5050");
    // Ball
    drawCircle(ball.x, ball.y, BALL_RADIUS, "#fff");
}

// Ball movement and collision
function update() {
    // Move ball
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Top/bottom wall collision
    if (ball.y - BALL_RADIUS < 0 || ball.y + BALL_RADIUS > canvas.height) {
        ball.vy = -ball.vy;
    }

    // Player paddle collision
    if (
        ball.x - BALL_RADIUS < PLAYER_X + PADDLE_WIDTH &&
        ball.y > playerY &&
        ball.y < playerY + PADDLE_HEIGHT
    ) {
        ball.x = PLAYER_X + PADDLE_WIDTH + BALL_RADIUS; // prevent sticking
        let impact = (ball.y - (playerY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
        ball.vx = Math.abs(ball.vx); // always right
        ball.vy = ball.speed * impact;
        ball.speed += 0.2;
        ball.vx = ball.speed;
    }

    // AI paddle collision
    if (
        ball.x + BALL_RADIUS > AI_X &&
        ball.y > aiY &&
        ball.y < aiY + PADDLE_HEIGHT
    ) {
        ball.x = AI_X - BALL_RADIUS; // prevent sticking
        let impact = (ball.y - (aiY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
        ball.vx = -Math.abs(ball.vx); // always left
        ball.vy = ball.speed * impact;
        ball.speed += 0.2;
        ball.vx = -ball.speed;
    }

    // Score
    if (ball.x < 0) {
        aiScore++;
        resetBall();
    }
    if (ball.x > canvas.width) {
        playerScore++;
        resetBall();
    }

    // AI paddle movement
    let target = ball.y - (PADDLE_HEIGHT / 2);
    if (aiY + PADDLE_HEIGHT/2 < ball.y - 18) {
        aiY += Math.min(PADDLE_SPEED, target - aiY);
    } else if (aiY + PADDLE_HEIGHT/2 > ball.y + 18) {
        aiY -= Math.min(PADDLE_SPEED, aiY - target);
    }
    aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 6;
    ball.vx = ball.speed * (Math.random() > 0.5 ? 1 : -1);
    ball.vy = ball.speed * (Math.random() * 2 - 1);
}

// Player paddle control by mouse
canvas.addEventListener('mousemove', function(evt) {
    let rect = canvas.getBoundingClientRect();
    let mouseY = evt.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

// Main game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();