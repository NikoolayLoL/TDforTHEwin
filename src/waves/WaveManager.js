import EnemyFactory from './EnemyFactory.js';

export default class WaveManager {
    constructor(game) {
        this.game = game;
        this.waveNumber = 0;
        this.enemies = [];
        this.spawnTimer = 0;
        this.spawnInterval = 1.5; // Initial spawn interval
        this.enemiesToSpawn = 0;
        this.enemyFactory = new EnemyFactory(game);
        this.nextWave();
    }

    update(dt) {
        this.spawnTimer -= dt;
        if (this.spawnTimer <= 0 && this.enemiesToSpawn > 0) {
            this.spawnEnemy();
            this.enemiesToSpawn--;
            this.spawnTimer = this.spawnInterval;
        }

        this.enemies.forEach(enemy => {
            enemy.update(this.game.tower.x, this.game.tower.y, dt);
        });

        if (this.enemies.length === 0 && this.enemiesToSpawn === 0) {
            this.nextWave();
        }
    }

    draw(ctx) {
        this.enemies.forEach(enemy => enemy.draw(ctx));
    }

    nextWave() {
        this.waveNumber++;
        if (this.waveNumber % 5 === 0) {
            this.enemiesToSpawn = 1; // Just the boss
        } else if (this.waveNumber <= 2) {
            // Easier start for the first 2 waves
            this.enemiesToSpawn = 2 + this.waveNumber;
        } else if (this.waveNumber <= 8) {
            // Linear increase for mid-game
            this.enemiesToSpawn = 2 * this.waveNumber;
        } else {
            // Exponential increase for late game
            this.enemiesToSpawn = Math.floor(16 * Math.pow(1.2, this.waveNumber - 8));
        }
        this.spawnInterval = Math.max(0.2, 1.5 - this.waveNumber * 0.05);
        this.spawnTimer = 3; // 3-second grace period before the next wave
    }

    spawnEnemy() {
        const enemy = this.enemyFactory.createEnemy(this.waveNumber);
        this.enemies.push(enemy);
    }
}