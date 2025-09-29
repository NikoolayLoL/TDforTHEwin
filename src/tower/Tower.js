import Projectile from './Projectile.js';

export default class Tower {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 20;
        this.range = 150;
        this.attackSpeed = 1; // attacks per second
        this.damage = 20;
        this.health = 100;
        this.regen = 1; // health per second
        this.attackCooldown = 0;
        this.target = null;

        this.rangeCost = 10;
        this.speedCost = 10;
        this.damageCost = 10;
    }

    resetUpgrades() {
        this.rangeCost = 10;
        this.speedCost = 10;
        this.damageCost = 10;
    }

    update(enemies, dt = 0) {
        if (this.attackCooldown > 0) {
            this.attackCooldown -= dt;
        }

        this.findTarget(enemies);

        if (this.target && this.attackCooldown <= 0) {
            this.shoot();
            this.attackCooldown = 1 / this.attackSpeed;
        }
    }

    draw(ctx) {
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw range
        ctx.strokeStyle = 'rgba(0, 0, 255, 0.2)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
        ctx.stroke();
    }

    findTarget(enemies) {
        this.target = null;
        let closestDist = this.range;

        enemies.forEach(enemy => {
            const dist = Math.hypot(this.x - enemy.x, this.y - enemy.y);
            if (dist < closestDist) {
                closestDist = dist;
                this.target = enemy;
            }
        });
    }

    shoot() {
        if (this.target) {
            const angle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
            const projectile = new Projectile(this.x, this.y, angle);
            this.game.projectiles.push(projectile);
        }
    }

    upgradeRange() {
        if (this.game.gold >= this.rangeCost) {
            this.game.gold -= this.rangeCost;
            this.range += 15;
            this.rangeCost = Math.floor(this.rangeCost * 1.5);
        }
    }

    upgradeSpeed() {
        if (this.game.gold >= this.speedCost) {
            this.game.gold -= this.speedCost;
            this.attackSpeed += 0.1;
            this.speedCost = Math.floor(this.speedCost * 1.5);
        }
    }

    upgradeDamage() {
        if (this.game.gold >= this.damageCost) {
            this.game.gold -= this.damageCost;
            this.damage += 6;
            this.damageCost = Math.floor(this.damageCost * 1.5);
        }
    }
}
