// src/game/BlitzGame.js
import Game from './Game.js';
import BlitzInventory from '../inventory/BlitzInventory.js';
import BlitzLootSystem from '../loot/BlitzLootSystem.js';
import BuffSystem from '../effects/BuffSystem.js';

export default class BlitzGame extends Game {
    constructor(width, height, seed = null) {
        super(width, height, seed);
        
        // Replace regular inventory with blitz inventory
        this.inventory = new BlitzInventory();
        this.buffSystem = new BuffSystem(this.inventory.getActiveItems());
        
        // Override enemy manager to apply blitz scaling
        this.setupBlitzEnemyScaling();
    }

    // Setup enhanced enemy scaling for blitz mode
    setupBlitzEnemyScaling() {
        const originalGenerateWave = this.waveManager.enemyManager.generateWave.bind(this.waveManager.enemyManager);
        
        this.waveManager.enemyManager.generateWave = (waveNumber, spawnX, spawnY) => {
            const enemies = originalGenerateWave(waveNumber, spawnX, spawnY);
            
            // Apply enhanced blitz scaling
            enemies.forEach(enemy => {
                // Enhanced health scaling: 10% per wave instead of 5%
                const blitzHealthMultiplier = 1 + (waveNumber - 1) * 0.10;
                
                // Apply the enhanced scaling
                enemy.hp = Math.floor(enemy.hp * blitzHealthMultiplier);
                enemy.health = enemy.hp;
                enemy.maxHealth = enemy.hp;
                
                console.log(`Blitz scaling applied to ${enemy.name}: Wave ${waveNumber}, HP: ${enemy.hp}`);
            });
            
            return enemies;
        };
    }

    handleEnemyDeath(enemy) {
        enemy.hasDroppedLoot = true;
        
        let shouldDrop = false;
        let dropChance = 0;

        if (enemy.isBoss) {
            dropChance = BlitzLootSystem.getBossDropChance();
        } else if (enemy.isElite) {
            dropChance = BlitzLootSystem.getEliteDropChance();
        } else {
            dropChance = BlitzLootSystem.getNormalEnemyDropChance();
        }

        shouldDrop = Math.random() < dropChance;

        if (shouldDrop) {
            const newItem = BlitzLootSystem.generateBlitzItem(enemy.isBoss, enemy.isElite);
            
            // Use auto-upgrade system instead of pausing
            const result = this.inventory.tryAddItemWithAutoUpgrade(newItem);
            
            if (result.success) {
                // Update buff system with new inventory
                this.buffSystem = new BuffSystem(this.inventory.getActiveItems());
                console.log(`Item ${result.action}: ${newItem.name}`);
                
                // Update UI
                this.inventory.renderUI();
            } else {
                console.log(`Item ${result.action}: ${newItem.name}`);
            }
        }
    }

    update(dt) {
        // Call parent update method
        super.update(dt);
        
        // Don't continuously re-render inventory UI - only when items change
    }

    draw(ctx) {
        // Call parent draw method
        super.draw(ctx);
        
        // Additional blitz-specific drawing could go here
    }

    restart() {
        // Clear blitz inventory
        this.inventory.clear();
        
        // Call parent restart method
        super.restart();
        
        // Re-initialize buff system
        this.buffSystem = new BuffSystem(this.inventory.getActiveItems());
        
        // Update UI
        this.inventory.renderUI();
    }
}