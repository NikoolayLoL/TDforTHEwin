export default class Projectile {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.radius = 5;
        this.speed = 300; // px/sec
        this.active = true;
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
    }

    update(dt) {
        this.x += this.vx * this.speed * dt;
        this.y += this.vy * this.speed * dt;

        // Deactivate projectile if it goes off-screen
        if (this.isOffScreen()) {
            this.active = false;
        }
    }

    draw(ctx) {
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    isOffScreen(width, height) {
        return this.x < 0 || this.x > width || this.y < 0 || this.y > height;
    }
}
