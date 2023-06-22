const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

let player = { x: canvas.width / 2, y: canvas.height / 2, dx: 0, dy: 0, rot: 0 };
let bullets = [];
let asteroids = [];
let score = 0;

function addAsteroid() {
    let x, y;
    if (Math.random() < 0.5) {
        x = Math.random() < 0.5 ? 0 : canvas.width;
        y = Math.random() * canvas.height;
    } else {
        x = Math.random() * canvas.width;
        y = Math.random() < 0.5 ? 0 : canvas.height;
    }
    let angle = Math.atan2(player.y - y, player.x - x);
    let speed = Math.random() * 2 + 1;
    let dx = Math.cos(angle) * speed;
    let dy = Math.sin(angle) * speed;
    asteroids.push({ x, y, dx, dy });
}

for (let i = 0; i < 10; i++) addAsteroid();

function update() {
    player.x += player.dx;
    player.y += player.dy;

    if (player.x < 0) player.x = canvas.width;
    if (player.x > canvas.width) player.x = 0;
    if (player.y < 0) player.y = canvas.height;
    if (player.y > canvas.height) player.y = 0;

    bullets = bullets.filter(bullet => {
        bullet.x += bullet.dx;
        bullet.y += bullet.dy;

        if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
            return false;
        }

        for (let i = 0; i < asteroids.length; i++) {
            let asteroid = asteroids[i];
            let dx = asteroid.x - bullet.x;
            let dy = asteroid.y - bullet.y;
            if (Math.sqrt(dx * dx + dy * dy) < 20) {
                asteroids.splice(i, 1);
                score++;
                scoreElement.textContent = score;
                addAsteroid();
                return false;
            }
        }

        return true;
    });

    asteroids.forEach(asteroid => {
        asteroid.x += asteroid.dx;
        asteroid.y += asteroid.dy;

        if (asteroid.x < 0) asteroid.x = canvas.width;
        if (asteroid.x > canvas.width) asteroid.x = 0;
        if (asteroid.y < 0) asteroid.y = canvas.height;
        if (asteroid.y > canvas.height) asteroid.y = 0;
    });

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FFF';

    ctx.beginPath();
    ctx.arc(player.x, player.y, 10, 0, Math.PI * 2);
    ctx.fill();

    bullets.forEach(bullet => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, 2, 0, Math.PI * 2);
        ctx.fill();
    });

    asteroids.forEach(asteroid => {
        ctx.beginPath();
        ctx.arc(asteroid.x, asteroid.y, 20, 0, Math.PI * 2);
        ctx.fill();
    });

    requestAnimationFrame(update);
}

update();

window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp': player.dy = -2; break;
        case 'ArrowDown': player.dy = 2; break;
        case 'ArrowLeft': player.dx = -2; break;
        case 'ArrowRight': player.dx = 2; break;
    }
});

window.addEventListener('keyup', e => {
    switch (e.key) {
        case 'ArrowUp': 
        case 'ArrowDown': player.dy = 0; break;
        case 'ArrowLeft': 
        case 'ArrowRight': player.dx = 0; break;
    }
});

canvas.addEventListener('click', e => {
    let dx = e.clientX - player.x;
    let dy = e.clientY - player.y;
    let len = Math.sqrt(dx * dx + dy * dy);
    bullets.push({ x: player.x, y: player.y, dx: dx / len * 5, dy: dy / len * 5 });
});
