import EnemyType1 from '../enemies/EnemyType1.js';
import EnemyType2 from '../enemies/EnemyType2.js';
import EnemyType3 from '../enemies/EnemyType3.js';
import BossEnemy from '../enemies/BossEnemy.js';

export default class EnemyFactory {
    constructor(game) {
        this.game = game;
    }

    createEnemy(waveNumber) {
        const side = Math.floor(Math.random() * 3);
        let x, y;

        switch (side) {
            case 0: // Top
                x = Math.random() * this.game.width;
                y = 0;
                break;
            case 1: // Left
                x = 0;
                y = Math.random() * this.game.height;
                break;
            case 2: // Right
                x = this.game.width;
                y = Math.random() * this.game.height;
                break;
        }

        const healthMultiplier = 1 + (waveNumber - 1) * 0.05;
        const speedModifier = 1 + (waveNumber - 1) * 0.02;

        if (waveNumber % 5 === 0) {
            const boss = new BossEnemy(x, y, healthMultiplier, speedModifier, true, false); // isBoss = true
            console.log(boss.toString());
            return boss;
        }

        let enemyType;
        let isElite = false;
        
        if (waveNumber >= 6) {
            const rand = Math.random();
            // 20% chance for elite enemies in later waves
            isElite = Math.random() < 0.2;
            
            if (rand < 0.33) {
                enemyType = EnemyType1;
            } else if (rand < 0.66) {
                enemyType = EnemyType2;
            } else {
                enemyType = EnemyType3;
            }
        } else if (waveNumber >= 3) {
            // 10% chance for elite in mid-game
            isElite = Math.random() < 0.1;
             if (Math.random() < 0.5) {
                enemyType = EnemyType1;
            } else {
                enemyType = EnemyType2;
            }
        } else {
            enemyType = EnemyType1;
        }

        const enemy = new enemyType(x, y, healthMultiplier, speedModifier, false, isElite); // isBoss = false, isElite = variable
        console.log(enemy.toString());
        return enemy;
    }
}
