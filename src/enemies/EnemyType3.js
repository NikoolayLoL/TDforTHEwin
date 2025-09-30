import Enemy from './Enemy.js';

export default class EnemyType3 extends Enemy {
    static health = 75;
    static speed = 36; // px/sec
    static goldValue = 15;
    static color = 'orange';
    static healthScalingFactor = 0.6;
    static speedScalingFactor = 1.5;

    constructor(x, y, healthMultiplier, speedModifier, isBoss = false, isElite = false) {
        super(x, y, EnemyType3.health, EnemyType3.speed, EnemyType3.goldValue, EnemyType3.color, healthMultiplier, EnemyType3.healthScalingFactor, speedModifier, EnemyType3.speedScalingFactor, isBoss, isElite);
        this.radius = isElite ? 12 : (isBoss ? 15 : 8);
    }
}
