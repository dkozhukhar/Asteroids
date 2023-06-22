const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const spaceship = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: 0,
    dy: 0,
    r: 20,
    rotation: 0,
    thrusting: false,
    draw: function() {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo( // nose of the spaceship
            this.x + this.r * Math.cos(this.rotation),
            this.y - this.r * Math.sin(this.rotation)
        );
        ctx.lineTo( // rear left
            this.x - this.r * (Math.cos(this.rotation) + Math.sin(this.rotation)),
            this.y + this.r * (Math.sin(this.rotation) - Math.cos(this.rotation))
        );
        ctx.lineTo( // rear right
            this.x - this.r * (Math.cos(this.rotation) - Math.sin(this.rotation)),
            this.y + this.r * (Math.sin(this.rotation) + Math.cos(this.rotation))
        );
        ctx.closePath();
        ctx.stroke();
    }
};

const FPS = 60;  // frames per second
const TURN_SPEED = 360;  // degrees per second
const THRUST = 5;  // acceleration of spaceship in pixels per second^2

function update() {
    // rotation
    spaceship.rotation += spaceship.turningLeft ? TURN_SPEED / 180 * Math.PI / FPS : 0;
    spaceship.rotation -= spaceship.turningRight ? TURN_SPEED / 180 * Math.PI / FPS : 0;

    // thrust
    if (spaceship.thrusting) {
        spaceship.dx += THRUST * Math.cos(spaceship.rotation) / FPS;
        spaceship.dy -= THRUST * Math.sin(spaceship.rotation) / FPS;
    }

    // move spaceship
    spaceship.x += spaceship.dx;
    spaceship.y += spaceship.dy;

    // handle edges of screen
    if (spaceship.x < 0 - spaceship.r) {
        spaceship.x = canvas.width + spaceship.r;
    } else if (spaceship.x > canvas.width + spaceship.r) {
        spaceship.x = 0 - spaceship.r;
    }
    if (spaceship.y < 0 - spaceship.r) {
        spaceship.y = canvas.height + spaceship.r;
    } else if (spaceship.y > canvas.height + spaceship.r) {
        spaceship.y = 0 - spaceship.r;
    }

    // draw spaceship
    spaceship.draw();

    // call update again after a delay
    setTimeout(update, 1000 / FPS);
}

// start game loop
update();


window.addEventListener('keydown', function(e) {
    switch (e.keyCode) {
        case 37:  // left arrow (rotate left)
            spaceship.turningLeft = true;
            break;
        case 39:  // right arrow (rotate right)
            spaceship.turningRight = true;
            break;
        case 38:  // up arrow (thrust)
            spaceship.thrusting = true;
            break;
    }
});

window.addEventListener('keyup', function(e) {
    switch (e.keyCode) {
        case 37:  // left arrow (stop rotating left)
            spaceship.turningLeft = false;
            break;
        case 39:  // right arrow (stop rotating right)
            spaceship.turningRight = false;
            break;
        case 38:  // up arrow (stop thrusting)
            spaceship.thrusting = false;
            break;
    }
});
