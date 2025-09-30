import EnemyManager from '../enemies/EnemyManager.js';

export default class WaveManager {
    constructor(game) {
        this.game = game;
        this.waveNumber = 0;
        this.enemies = [];
        this.spawnTimer = 0;
        this.spawnInterval = 1.5; // Initial spawn interval
        this.enemiesToSpawn = [];
        this.enemySpawnIndex = 0;
        this.enemyManager = new EnemyManager();
        this.spawnPositions = [];
        this.nextWave();
    }

    update(dt) {
        this.spawnTimer -= dt;
        if (this.spawnTimer <= 0 && this.enemySpawnIndex < this.enemiesToSpawn.length) {
            this.spawnEnemy();
            this.spawnTimer = this.spawnInterval;
        }

        this.enemies.forEach(enemy => {
            enemy.update(this.game.tower.x, this.game.tower.y, dt);
        });

        if (this.enemies.length === 0 && this.enemySpawnIndex >= this.enemiesToSpawn.length) {
            this.nextWave();
        }
    }

    draw(ctx) {
        this.enemies.forEach(enemy => enemy.draw(ctx));
    }

    nextWave() {
        this.waveNumber++;
        
        // Generate wave using the new enemy system with cone formation
        const enemyCount = this.calculateEnemyCount();
        this.spawnPositions = this.game.spawnManager.generateConeSpawnPositions(
            enemyCount, 
            this.waveNumber, 
            this.game.tower.x, 
            this.game.tower.y
        );
        
        this.enemiesToSpawn = [];
        this.spawnPositions.forEach((spawnPos, index) => {
            const enemies = this.enemyManager.generateWave(1, spawnPos.x, spawnPos.y);
            if (enemies.length > 0) {
                const enemy = enemies[0];
                enemy.x = spawnPos.x;
                enemy.y = spawnPos.y;
                enemy.spawnDelay = spawnPos.delay;
                this.enemiesToSpawn.push(enemy);
            }
        });
        
        this.enemySpawnIndex = 0;
        
        // Adjust spawn interval based on wave
        this.spawnInterval = Math.max(0.2, 1.5 - this.waveNumber * 0.05);
        this.spawnTimer = 3; // 3-second grace period before the next wave
    }

    calculateEnemyCount() {
        if (this.waveNumber % 5 === 0) {
            return 3; // Boss waves have fewer but stronger enemies
        } else if (this.waveNumber <= 2) {
            return 2 + this.waveNumber;
        } else if (this.waveNumber <= 8) {
            return Math.floor(1.5 * this.waveNumber);
        } else {
            return Math.floor(12 * Math.pow(1.15, this.waveNumber - 8));
        }
    }

    spawnEnemy() {
        if (this.enemySpawnIndex < this.enemiesToSpawn.length) {
            const enemy = this.enemiesToSpawn[this.enemySpawnIndex];
            this.enemies.push(enemy);
            this.enemySpawnIndex++;
        }
    }
}