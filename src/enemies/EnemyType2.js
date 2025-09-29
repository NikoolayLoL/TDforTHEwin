import Enemy from './Enemy.js';

export default class EnemyType2 extends Enemy {
    static health = 100;
    static speed = 18; // px/sec
    static goldValue = 10;
    static color = 'purple';
    static healthScalingFactor = 0.5;
    static speedScalingFactor = 1.2;

    constructor(x, y, healthMultiplier, speedModifier) {
        super(x, y, EnemyType2.health, EnemyType2.speed, EnemyType2.goldValue, EnemyType2.color, healthMultiplier, EnemyType2.healthScalingFactor, speedModifier, EnemyType2.speedScalingFactor);
        this.radius = 15;
    }
}
