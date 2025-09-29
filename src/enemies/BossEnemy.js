import Enemy from './Enemy.js';

export default class BossEnemy extends Enemy {
    static health = 300;
    static speed = 15; // px/sec
    static goldValue = 100;
    static color = 'black';
    static healthScalingFactor = 0.3;
    static speedScalingFactor = 0.5;

    constructor(x, y, healthMultiplier, speedModifier) {
        super(x, y, BossEnemy.health, BossEnemy.speed, BossEnemy.goldValue, BossEnemy.color, healthMultiplier, BossEnemy.healthScalingFactor, speedModifier, BossEnemy.speedScalingFactor);
        this.radius = 30;
    }

    /**
     * Drops loot based on game state.
     * @param {Game} game - The main game object.
     */
    dropLoot(game) {
        // Placeholder for loot drop logic.
        // The quality/quantity of the loot can be determined by the number of lives lost.
        // A higher number of lost lives could result in lower quality loot, with a bit of randomness.
        console.log('Boss dropped loot!');
    }
}
