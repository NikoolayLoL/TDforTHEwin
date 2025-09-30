// src/enemies/EnemyManager.js
import { enemyDefinitions, bossDefinitions, eliteModifiers, waveCompositions } from './enemyDefinitions.js';
import Enemy from './Enemy.js';

export default class EnemyManager {
    constructor() {
        this.enemies = [];
    }

    // Get wave composition based on wave number
    getWaveComposition(waveNumber) {
        for (const [key, composition] of Object.entries(waveCompositions)) {
            if (waveNumber >= composition.minWave && waveNumber <= composition.maxWave) {
                return composition;
            }
        }
        // Default to endgame if wave is very high
        return waveCompositions.endgame;
    }

    // Get available enemy types for a wave
    getAvailableEnemyTypes(waveNumber) {
        const availableTypes = [];
        
        for (const [key, definition] of Object.entries(enemyDefinitions)) {
            if (waveNumber >= definition.minWave && waveNumber <= definition.maxWave) {
                availableTypes.push({ key, definition });
            }
        }
        
        return availableTypes;
    }

    // Get available boss types for a wave
    getAvailableBossTypes(waveNumber) {
        const availableTypes = [];
        
        for (const [key, definition] of Object.entries(bossDefinitions)) {
            if (waveNumber >= definition.minWave && waveNumber <= definition.maxWave) {
                availableTypes.push({ key, definition });
            }
        }
        
        return availableTypes;
    }

    // Select enemy type based on weights
    selectWeightedEnemyType(availableTypes) {
        const totalWeight = availableTypes.reduce((sum, type) => sum + type.definition.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const type of availableTypes) {
            random -= type.definition.weight;
            if (random <= 0) {
                return type;
            }
        }
        
        // Fallback to first type
        return availableTypes[0];
    }

    // Select random elite modifier
    selectEliteModifier() {
        const modifierKeys = Object.keys(eliteModifiers);
        const randomKey = modifierKeys[Math.floor(Math.random() * modifierKeys.length)];
        return { key: randomKey, modifier: eliteModifiers[randomKey] };
    }

    // Create an enemy from definition
    createEnemyFromDefinition(x, y, definition, isElite = false, isBoss = false, eliteModifier = null) {
        let stats = { ...definition };
        let name = definition.name;
        let color = definition.color;
        let glowColor = null;

        // Apply elite modifiers
        if (isElite && eliteModifier) {
            stats.hp = Math.floor(stats.hp * eliteModifier.modifier.hpMultiplier);
            stats.speed = Math.floor(stats.speed * eliteModifier.modifier.speedMultiplier);
            stats.goldReward = Math.floor(stats.goldReward * eliteModifier.modifier.goldMultiplier);
            name = `${eliteModifier.modifier.name} ${name}`;
            color = eliteModifier.modifier.color;
            glowColor = eliteModifier.modifier.glowColor;
        }

        // Create the enemy
        const enemy = new Enemy(x, y, stats.hp, stats.speed, stats.goldReward);
        enemy.name = name;
        enemy.color = color;
        enemy.size = stats.size;
        enemy.isElite = isElite;
        enemy.isBoss = isBoss;
        
        if (glowColor) {
            enemy.glowColor = glowColor;
        }

        return enemy;
    }

    // Generate a wave of enemies
    generateWave(waveNumber, spawnX, spawnY) {
        const composition = this.getWaveComposition(waveNumber);
        const availableEnemyTypes = this.getAvailableEnemyTypes(waveNumber);
        const availableBossTypes = this.getAvailableBossTypes(waveNumber);
        
        if (availableEnemyTypes.length === 0) {
            console.warn(`No available enemy types for wave ${waveNumber}`);
            return [];
        }

        const waveEnemies = [];
        const baseEnemyCount = Math.min(
            Math.floor(composition.maxEnemies * (0.8 + (waveNumber * 0.02))),
            composition.maxEnemies
        );

        // Generate regular enemies
        for (let i = 0; i < baseEnemyCount; i++) {
            const selectedType = this.selectWeightedEnemyType(availableEnemyTypes);
            const isElite = Math.random() < composition.eliteChance;
            const eliteModifier = isElite ? this.selectEliteModifier() : null;
            
            const enemy = this.createEnemyFromDefinition(
                spawnX, 
                spawnY, 
                selectedType.definition, 
                isElite, 
                false, 
                eliteModifier
            );
            
            waveEnemies.push(enemy);
        }

        // Maybe add a boss
        if (availableBossTypes.length > 0 && Math.random() < composition.bossChance) {
            const selectedBoss = this.selectWeightedEnemyType(availableBossTypes);
            const boss = this.createEnemyFromDefinition(
                spawnX, 
                spawnY, 
                selectedBoss.definition, 
                false, 
                true
            );
            
            waveEnemies.push(boss);
        }

        return waveEnemies;
    }

    // Add enemies to the manager
    addEnemies(enemies) {
        this.enemies.push(...enemies);
    }

    // Update all enemies
    update(towerX, towerY, dt) {
        this.enemies.forEach(enemy => {
            enemy.update(towerX, towerY, dt);
        });
    }

    // Draw all enemies
    draw(ctx) {
        this.enemies.forEach(enemy => {
            enemy.draw(ctx);
        });
    }

    // Remove enemies that have reached the target or died
    removeDeadEnemies() {
        this.enemies = this.enemies.filter(enemy => enemy.hp > 0 && !enemy.hasReachedTarget);
        return this.enemies.length;
    }

    // Get enemies that have reached the target
    getEnemiesAtTarget() {
        return this.enemies.filter(enemy => enemy.hasReachedTarget && enemy.hp > 0);
    }

    // Clear all enemies
    clear() {
        this.enemies = [];
    }
}