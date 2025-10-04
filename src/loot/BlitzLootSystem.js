// src/loot/BlitzLootSystem.js
import LootSystem from './LootSystem.js';
import { effects } from '../effects/effectDefinitions.js';
import Item from '../inventory/Item.js';

export default class BlitzLootSystem extends LootSystem {
    // Higher drop chances for blitz mode (reduced by half)
    static getBossDropChance() {
        return 0.3; // 47.5% (was 95%)
    }

    static getEliteDropChance() {
        return 0.20; // 30% (was 60%)
    }

    static getNormalEnemyDropChance() {
        return 0.10; // 12.5% (was 25%)
    }

    // Adjusted rarity weights for blitz mode (more lower-tier items from normal enemies)
    static getBlitzRarityWeights() {
        return {
            common: 75,    // Higher chance of common items
            rare: 20,      // Slightly lower rare chance
            epic: 4,       // Lower epic chance
            legendary: 1   // Much lower legendary chance
        };
    }

    // Select a rarity based on weighted probabilities
    static selectWeightedRarity(weights) {
        const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
        let random = Math.random() * totalWeight;

        for (const [rarity, weight] of Object.entries(weights)) {
            if (random <= weight) {
                return rarity;
            }
            random -= weight;
        }

        // Fallback to common
        return 'common';
    }

    // Generate an item for a specific rarity
    static generateItemForRarity(targetRarity) {
        const effectIds = Object.keys(effects).filter(id => effects[id].rarity === targetRarity);
        
        if (effectIds.length === 0) {
            // Fallback to common if no effects found for rarity
            return this.generateRandomItem();
        }

        const randomEffectId = effectIds[Math.floor(Math.random() * effectIds.length)];
        const effect = effects[randomEffectId];
        
        return new Item(
            this.generateItemName(effect),
            effect.description,
            randomEffectId
        );
    }

    // Generate item with blitz-specific weights for normal enemies
    static generateBlitzNormalEnemyItem() {
        const weights = this.getBlitzRarityWeights();
        const selectedRarity = this.selectWeightedRarity(weights);
        return this.generateItemForRarity(selectedRarity);
    }

    // Generate item for boss/elite with normal weights
    static generateBlitzBossEliteItem() {
        return this.generateRandomItem(); // Use normal weights for bosses/elites
    }

    // Main method to generate item based on enemy type
    static generateBlitzItem(isBoss = false, isElite = false) {
        if (isBoss || isElite) {
            return this.generateBlitzBossEliteItem();
        } else {
            return this.generateBlitzNormalEnemyItem();
        }
    }
}