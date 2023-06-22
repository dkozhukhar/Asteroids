class Asteroid {
    constructor(x, y, radius, level) {
        this.x = x; 
        this.y = y; 
        this.radius = radius; 
        this.level = level; // The current level of the asteroid (i.e., how many times it's been hit)
        this.splitCount = 3; // Number of smaller asteroids created when this one is hit
        this.speed = Math.random() * 3 + 1; // Random speed between 1 and 4
        this.angle = Math.random() * Math.PI * 2; // Random direction
        this.vertices = []; // Vertices for drawing the asteroid shape
        // Create vertices for a polygonal asteroid shape
        for(let i = 0; i < 10; i++) {
            this.vertices.push({
                x: -this.radius + Math.random() * this.radius * 2,
                y: -this.radius + Math.random() * this.radius * 2,
            });
        }
    }

    // Update the asteroid's position
    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        
        // Handle wrapping (when the asteroid goes off one edge of the screen, it re-appears on the other)
        if(this.x > canvas.width + this.radius) this.x = -this.radius;
        else if(this.x < -this.radius) this.x = canvas.width + this.radius;
        if(this.y > canvas.height + this.radius) this.y = -this.radius;
        else if(this.y < -this.radius) this.y = canvas.height + this.radius;
    }

    // Draw the asteroid on the canvas
    draw() {
        ctx.beginPath();
        ctx.moveTo(this.vertices[0].x + this.x, this.vertices[0].y + this.y);
        for(let i = 1; i < this.vertices.length; i++) {
            ctx.lineTo(this.vertices[i].x + this.x, this.vertices[i].y + this.y);
        }
        ctx.closePath();
        ctx.stroke();
    }

    // Break the asteroid into smaller pieces
    break() {
        // If the asteroid is already at the smallest level, it can't be broken further
        if(this.level <= 1) return [];
        const newAsteroids = [];
        for(let i = 0; i < this.splitCount; i++) {
            newAsteroids.push(new Asteroid(this.x, this.y, this.radius / 2, this.level - 1));
        }
        return newAsteroids;
    }
}

class Bullet {
    constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.speed = 10;
        this.lifetime = 100;  // You can adjust this to control how long bullets last
        this.velocity = {
            x: Math.cos(this.direction) * this.speed,
            y: Math.sin(this.direction) * this.speed
        };
    }

    update() {
        // Move the bullet
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // Decrease the lifetime
        this.lifetime--;

        // Handle wrapping
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
    }
}

class Ship {
    constructor(x, y) {
        this.position = {
            x: x,
            y: y
        };
        this.velocity = {
            x: 0,
            y: 0
        };
        this.rotation = 0; // In radians
        this.rotationSpeed = 0.05; // Speed at which the ship rotates
        this.thrust = 0.1; // Speed at which the ship accelerates
        this.radius = 10; // Radius of the ship, used for collision detection and drawing
    }

    update() {
        // Update the ship's position based on its velocity
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Wrap around the screen
        if (this.position.x < 0) this.position.x += canvas.width;
        if (this.position.y < 0) this.position.y += canvas.height;
        if (this.position.x > canvas.width) this.position.x -= canvas.width;
        if (this.position.y > canvas.height) this.position.y -= canvas.height;
    }

    draw() {
        ctx.save(); // Save the current state of the canvas

        // Move the origin of the canvas to the ship's position
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation); // Rotate the canvas to the ship's rotation

        // Draw the ship as a simple triangle
        ctx.beginPath();
        ctx.moveTo(this.radius, 0);
        ctx.lineTo(-this.radius, this.radius);
        ctx.lineTo(-this.radius, -this.radius);
        ctx.closePath();
        ctx.stroke();

        ctx.restore(); // Restore the canvas state
    }

    rotate(direction) {
        // Rotate the ship. The direction parameter should be -1 to rotate left or 1 to rotate right.
        this.rotation += this.rotationSpeed * direction;
    }

    thrustForward() {
        // Accelerate the ship in the direction it's currently facing
        this.velocity.x += Math.cos(this.rotation) * this.thrust;
        this.velocity.y += Math.sin(this.rotation) * this.thrust;
    }
}

// Game setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const asteroids = [];
const bullets = [];
let ship = new Ship(canvas.width / 2, canvas.height / 2);

function gameLoop() {
    // Clear the canvas for redrawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw the ship
    ship.update();
    ship.draw();

    // Update and draw all bullets
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].update();
        bullets[i].draw();

        // Check for bullet lifetime and remove if necessary
        if (bullets[i].isDead()) {
            bullets.splice(i, 1);
            i--; // Decrease counter to keep up with bullet removal
        }
    }

    // Update and draw all asteroids
    for (let i = 0; i < asteroids.length; i++) {
        asteroids[i].update();
        asteroids[i].draw();

        // Check for collisions between asteroids and bullets
        for (let j = 0; j < bullets.length; j++) {
            if (asteroids[i].collidesWith(bullets[j])) {
                asteroids[i].break(); // Break the asteroid into smaller pieces
                bullets.splice(j, 1); // Remove the bullet
                j--; // Decrease counter to keep up with bullet removal
                break; // No need to check this asteroid against other bullets
            }
        }

        // Check for collisions between asteroids and the ship
        if (asteroids[i].collidesWith(ship)) {
            // TODO: Handle game over condition
        }
    }

    // Request the next frame of the animation
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
