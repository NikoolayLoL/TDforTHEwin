import Projectile from './Projectile.js';
import * as config from '../config.js';

export default class Tower {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = config.config.towerRadius;
        
        // Base stats
        this.baseRange = config.config.towerBaseRange;
        this.baseAttackSpeed = config.config.towerBaseAttackSpeed;
        this.baseDamage = config.config.towerBaseDamage;

        // Current upgrade costs (dynamic)
        this.rangeCost = config.config.towerRangeUpgradeCost;
        this.speedCost = config.config.towerSpeedUpgradeCost;
        this.damageCost = config.config.towerDamageUpgradeCost;

        // Buffs will be stored here
        this.buffs = null;

        this.attackCooldown = 0;
        this.currentTarget = null;
    }

    // Getters for dynamic stat calculation
    get range() {
        const percentageBonus = this.buffs?.range?.percentage || 0;
        const flatBonus = this.buffs?.range?.flat || 0;
        return this.baseRange * (1 + percentageBonus) + flatBonus;
    }

    get attackSpeed() {
        const percentageBonus = this.buffs?.attackSpeed?.percentage || 0;
        const flatBonus = this.buffs?.attackSpeed?.flat || 0;
        return this.baseAttackSpeed * (1 + percentageBonus) + flatBonus;
    }

    get damage() {
        const percentageBonus = this.buffs?.damage?.percentage || 0;
        const flatBonus = this.buffs?.damage?.flat || 0;
        return this.baseDamage * (1 + percentageBonus) + flatBonus;
    }

    update(enemies, dt, buffs) {
        this.buffs = buffs; // Update buffs from game state
        this.attackCooldown -= dt;

        // If current target is dead, out of range, or no longer in enemies array, find a new one
        if (this.currentTarget && (
            this.currentTarget.health <= 0 || 
            this.getDistanceTo(this.currentTarget) > this.range ||
            !enemies.includes(this.currentTarget)
        )) {
            this.currentTarget = null;
        }

        if (!this.currentTarget) {
            this.currentTarget = this.findNearestEnemy(enemies);
        }

        // If there's a valid target and cooldown is ready, fire
        if (this.currentTarget && this.attackCooldown <= 0) {
            this.attackCooldown = 1 / this.attackSpeed;
            return new Projectile(this.x, this.y, this.currentTarget, this.damage);
        }
        return null;
    }

    findNearestEnemy(enemies) {
        let nearestEnemy = null;
        let minDistance = Infinity;

        enemies.forEach(enemy => {
            const distance = this.getDistanceTo(enemy);
            if (distance < this.range && distance < minDistance) {
                minDistance = distance;
                nearestEnemy = enemy;
            }
        });
        return nearestEnemy;
    }

    getDistanceTo(enemy) {
        return Math.hypot(this.x - enemy.x, this.y - enemy.y) - enemy.radius;
    }

    draw(ctx) {
        // Draw tower
        ctx.fillStyle = 'cyan';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw range
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
        ctx.stroke();
    }

    upgradeRange(gold) {
        const cost = this.rangeCost;
        if (gold >= cost) {
            this.baseRange += config.config.towerRangeUpgradeAmount;
            this.rangeCost = Math.floor(cost * 1.5);
            return gold - cost;
        }
        return gold;
    }

    upgradeSpeed(gold) {
        const cost = this.speedCost;
        if (gold >= cost) {
            this.baseAttackSpeed += config.config.towerSpeedUpgradeAmount;
            this.speedCost = Math.floor(cost * 1.5);
            return gold - cost;
        }
        return gold;
    }

    upgradeDamage(gold) {
        const cost = this.damageCost;
        if (gold >= cost) {
            this.baseDamage += config.config.towerDamageUpgradeAmount;
            this.damageCost = Math.floor(cost * 1.5);
            return gold - cost;
        }
        return gold;
    }
}
