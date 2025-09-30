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
    constructor(x, y, health, speed, goldValue, color, healthMultiplier = 1, healthScalingFactor = 1, speedModifier = 1, speedScalingFactor = 1, isBoss = false, isElite = false) {
        this.x = x;
        this.y = y;
        this.radius = isBoss ? 20 : (isElite ? 15 : 10);
        const finalHealthMultiplier = 1 + (healthMultiplier - 1) * healthScalingFactor;
        const scaledHealth = health * finalHealthMultiplier;
        this.health = scaledHealth;
        this.maxHealth = scaledHealth;
        const finalSpeedMultiplier = 1 + (speedModifier - 1) * speedScalingFactor;
        this.speed = speed * finalSpeedMultiplier;

        this.goldValue = goldValue;
        this.color = color;
        this.isBoss = isBoss;
        this.isElite = isElite;
        this.hasDroppedLoot = false; // Prevent multiple drops from same enemy
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
        // Special visual effects for boss and elite enemies
        if (this.isBoss) {
            // Boss glow effect
            ctx.shadowColor = '#ff0000';
            ctx.shadowBlur = 20;
            ctx.fillStyle = '#ff3333';
        } else if (this.isElite) {
            // Elite glow effect
            ctx.shadowColor = '#ffaa00';
            ctx.shadowBlur = 10;
            ctx.fillStyle = '#ffcc44';
        } else {
            ctx.fillStyle = this.color;
        }
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Reset shadow
        ctx.shadowBlur = 0;

        // Health bar
        const healthBarWidth = this.radius * 2;
        const healthBarHeight = this.isBoss ? 8 : (this.isElite ? 6 : 5);
        const healthBarX = this.x - this.radius;
        const healthBarY = this.y - this.radius - healthBarHeight - 2;

        ctx.fillStyle = 'grey';
        ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

        const currentHealthWidth = healthBarWidth * (this.health / this.maxHealth);
        let healthColor = 'green';
        if (this.isBoss) healthColor = '#ff3333';
        else if (this.isElite) healthColor = '#ffaa00';
        
        ctx.fillStyle = healthColor;
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
