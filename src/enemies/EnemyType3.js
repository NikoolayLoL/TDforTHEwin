import Enemy from './Enemy.js';

export default class EnemyType3 extends Enemy {
    static health = 75;
    static speed = 36; // px/sec
    static goldValue = 15;
    static color = 'orange';
    static healthScalingFactor = 0.6;
    static speedScalingFactor = 1.5;

    constructor(x, y, healthMultiplier, speedModifier) {
        super(x, y, EnemyType3.health, EnemyType3.speed, EnemyType3.goldValue, EnemyType3.color, healthMultiplier, EnemyType3.healthScalingFactor, speedModifier, EnemyType3.speedScalingFactor);
        this.radius = 8;
    }
}
