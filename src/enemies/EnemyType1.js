import Enemy from './Enemy.js';

export default class EnemyType1 extends Enemy {
    static health = 50;
    static speed = 24; // px/sec
    static goldValue = 5;
    static color = 'red';
    static healthScalingFactor = 0.9;
    static speedScalingFactor = 1.0;

    constructor(x, y, healthMultiplier, speedModifier) {
        super(x, y, EnemyType1.health, EnemyType1.speed, EnemyType1.goldValue, EnemyType1.color, healthMultiplier, EnemyType1.healthScalingFactor, speedModifier, EnemyType1.speedScalingFactor);
    }
}
