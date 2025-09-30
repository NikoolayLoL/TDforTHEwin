import Tower from '../tower/Tower.js';
import WaveManager from '../waves/WaveManager.js';
import UI from '../ui/UI.js';
import GameOver from './GameOver.js';
import BuffSystem from '../effects/BuffSystem.js';
import Inventory from '../inventory/Inventory.js';
import LootSystem from '../loot/LootSystem.js';
import * as config from '../config.js';

export default class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.speedMultiplier = 1;
        
        this.inventory = new Inventory();
        this.buffSystem = new BuffSystem(this.inventory.activeItems);
        
        this.tower = new Tower(this.width / 2, this.height / 2);
        this.waveManager = new WaveManager(this);
        this.ui = new UI(this);
        this.gameOverScreen = new GameOver();
        this.projectiles = [];
        this.lives = config.config.startingLives;
        this.gold = config.config.startingGold;
        this.isGameOver = false;
    }

    setSpeed(multiplier) {
        this.speedMultiplier = multiplier;
    }

    update(dt) {
        if (this.isGameOver) return;

        const effectiveDt = dt * this.speedMultiplier;
        const aggregatedBuffs = this.buffSystem.getAggregatedBuffs();

        const newProjectile = this.tower.update(this.waveManager.enemies, effectiveDt, aggregatedBuffs);
        if (newProjectile) {
            this.projectiles.push(newProjectile);
        }
        this.waveManager.update(effectiveDt);

        this.waveManager.enemies.forEach(enemy => {
            enemy.update(this.tower.x, this.tower.y, effectiveDt);
        });

        this.projectiles.forEach(projectile => {
            projectile.update(effectiveDt);
        });

        this.checkCollisions();

        if (this.lives <= 0) {
            this.isGameOver = true;
            this.gameOverScreen.show();
        }
    }

    draw(ctx) {
        this.tower.draw(ctx);
        this.waveManager.draw(ctx);
        this.projectiles.forEach(p => p.draw(ctx));
        this.ui.draw();
    }

    checkCollisions() {
        this.waveManager.enemies.forEach((enemy, eIndex) => {
            this.projectiles.forEach((projectile, pIndex) => {
                const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
                if (dist - enemy.radius - projectile.radius < 1) {
                    enemy.takeDamage(projectile.damage); // Use projectile's damage
                    this.projectiles.splice(pIndex, 1);
                    if (enemy.health <= 0 && !enemy.hasDroppedLoot) {
                        this.gold += enemy.goldValue;
                        this.handleEnemyDeath(enemy);
                        this.waveManager.enemies.splice(eIndex, 1);
                    }
                }
            });

            const towerDist = Math.hypot(this.tower.x - enemy.x, this.tower.y - enemy.y);
            if (towerDist - enemy.radius - this.tower.radius < 1) {
                this.lives--;
                this.waveManager.enemies.splice(eIndex, 1);
            }
        });
    }

    handleEnemyDeath(enemy) {
        enemy.hasDroppedLoot = true;
        
        let shouldDrop = false;
        if (enemy.isBoss) {
            shouldDrop = Math.random() < LootSystem.getBossDropChance();
        } else if (enemy.isElite) {
            shouldDrop = Math.random() < LootSystem.getEliteDropChance();
        }

        if (shouldDrop) {
            const newItem = LootSystem.generateRandomItem();
            const added = this.inventory.addItem(newItem);
            
            if (added) {
                // Update buff system with new inventory
                this.buffSystem = new BuffSystem(this.inventory.activeItems);
                
                // Show notification (you could add a visual effect here later)
                console.log(`New item found: ${newItem.name} - ${newItem.description}`);
            } else {
                console.log('Inventory full! Item lost.');
            }
        }
    }

    restart() {
        this.speedMultiplier = 1;
        this.inventory = new Inventory(); // Re-load inventory
        this.buffSystem = new BuffSystem(this.inventory.activeItems); // Re-create buff system
        this.tower = new Tower(this.width / 2, this.height / 2);
        this.waveManager = new WaveManager(this);
        this.projectiles = [];
        this.lives = config.config.startingLives;
        this.gold = config.config.startingGold;
        this.isGameOver = false;
        
        this.ui.draw();
        this.gameOverScreen.hide();
    }
}
