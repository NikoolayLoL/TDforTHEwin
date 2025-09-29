/**
 * @interface
 */
export default class Enemy {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} health
     * @param {number} speed
     * @param {number} goldValue
     */
    constructor(x, y, health, speed, goldValue, color, healthMultiplier = 1, healthScalingFactor = 1, speedModifier = 1, speedScalingFactor = 1) {
        this.x = x;
        this.y = y;
        this.radius = 10;
        const finalHealthMultiplier = 1 + (healthMultiplier - 1) * healthScalingFactor;
        const scaledHealth = health * finalHealthMultiplier;
        this.health = scaledHealth;
        this.maxHealth = scaledHealth;
        const finalSpeedMultiplier = 1 + (speedModifier - 1) * speedScalingFactor;
        this.speed = speed * finalSpeedMultiplier;

        this.goldValue = goldValue;
        this.color = color;
    }

    /**
     * @param {number} targetX
     * @param {number} targetY
     * @param {number} dt
     */
    update(targetX, targetY, dt = 0) {
        const angle = Math.atan2(targetY - this.y, targetX - this.x);
        this.x += Math.cos(angle) * this.speed * dt;
        this.y += Math.sin(angle) * this.speed * dt;
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Health bar
        const healthBarWidth = this.radius * 2;
        const healthBarHeight = 5;
        const healthBarX = this.x - this.radius;
        const healthBarY = this.y - this.radius - healthBarHeight - 2;

        ctx.fillStyle = 'grey';
        ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

        const currentHealthWidth = healthBarWidth * (this.health / this.maxHealth);
        ctx.fillStyle = 'green';
        ctx.fillRect(healthBarX, healthBarY, currentHealthWidth, healthBarHeight);
    }

    /**
     * @param {number} amount
     */
    takeDamage(amount) {
        this.health -= amount;
    }

    toString() {
        return `${this.constructor.name} - Health: ${this.health.toFixed(2)}, Speed: ${this.speed}`;
    }
}
