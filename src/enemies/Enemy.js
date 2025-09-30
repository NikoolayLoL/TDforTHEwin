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
        this.hp = scaledHealth; // Use hp to match the rest of the codebase
        this.health = scaledHealth; // Keep health for backward compatibility
        this.maxHealth = scaledHealth;
        const finalSpeedMultiplier = 1 + (speedModifier - 1) * speedScalingFactor;
        this.speed = speed * finalSpeedMultiplier;

        this.goldValue = goldValue;
        this.color = color || '#ff4444';
        this.size = this.radius; // Support both size and radius
        this.name = "Enemy"; // Default name
        this.glowColor = null; // For elite effects
        this.isBoss = isBoss;
        this.isElite = isElite;
        this.hasDroppedLoot = false; // Prevent multiple drops from same enemy
        this.hasReachedTarget = false; // Track if enemy reached the target
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
        
        // Check if enemy has reached the target (within 20 pixels)
        const distance = Math.sqrt((targetX - this.x) ** 2 + (targetY - this.y) ** 2);
        if (distance < 20) {
            this.hasReachedTarget = true;
        }
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        // Use size if set, otherwise fall back to radius
        const drawRadius = this.size || this.radius;
        
        // Special visual effects for boss and elite enemies
        if (this.isBoss) {
            // Boss glow effect
            ctx.shadowColor = '#ff0000';
            ctx.shadowBlur = 20;
            ctx.fillStyle = this.color || '#ff3333';
        } else if (this.isElite) {
            // Elite glow effect with custom glow color if available
            ctx.shadowColor = this.glowColor || '#ffaa00';
            ctx.shadowBlur = 10;
            ctx.fillStyle = this.color || '#ffcc44';
        } else {
            ctx.fillStyle = this.color;
        }
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, drawRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Reset shadow
        ctx.shadowBlur = 0;

        // Health bar
        const healthBarWidth = drawRadius * 2;
        const healthBarHeight = this.isBoss ? 8 : (this.isElite ? 6 : 5);
        const healthBarX = this.x - drawRadius;
        const healthBarY = this.y - drawRadius - healthBarHeight - 2;

        ctx.fillStyle = 'grey';
        ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

        const currentHealthWidth = healthBarWidth * (this.hp / this.maxHealth);
        let healthColor = 'green';
        if (this.isBoss) healthColor = '#ff3333';
        else if (this.isElite) healthColor = this.glowColor || '#ffaa00';
        
        ctx.fillStyle = healthColor;
        ctx.fillRect(healthBarX, healthBarY, currentHealthWidth, healthBarHeight);
    }

    /**
     * @param {number} amount
     */
    takeDamage(amount) {
        this.hp -= amount;
        this.health = this.hp; // Keep health in sync
    }

    toString() {
        return `${this.name || this.constructor.name} - Health: ${this.hp.toFixed(2)}, Speed: ${this.speed}`;
    }
}
