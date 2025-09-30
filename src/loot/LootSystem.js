// src/loot/LootSystem.js
import { effects, rarityWeights } from '../effects/effectDefinitions.js';
import Item from '../inventory/Item.js';

export default class LootSystem {
    static generateRandomItem() {
        const effectId = this.selectRandomEffect();
        const effect = effects[effectId];
        
        return new Item(
            this.generateItemName(effect),
            effect.description,
            effectId
        );
    }

    static selectRandomEffect() {
        const effectIds = Object.keys(effects);
        const totalWeight = Object.values(rarityWeights).reduce((sum, weight) => sum + weight, 0);
        let random = Math.random() * totalWeight;

        for (const effectId of effectIds) {
            const effect = effects[effectId];
            const weight = rarityWeights[effect.rarity];
            
            if (random <= weight) {
                return effectId;
            }
            random -= weight;
        }

        // Fallback to a common effect
        return effectIds.find(id => effects[id].rarity === 'common');
    }

    static generateItemName(effect) {
        const nameTemplates = {
            damage: {
                common: ['Iron Blade', 'Sharp Edge', 'Power Core'],
                rare: ['Steel Striker', 'Vorpal Weapon', 'Fury Engine'],
                epic: ['Dragonslayer', 'Void Crusher', 'Phoenix Fang'],
                legendary: ['Apocalypse', 'World Ender', 'Divine Wrath']
            },
            range: {
                common: ['Scope', 'Lens', 'Spyglass'],
                rare: ['Eagle Eye', 'Far Sight', 'Hunter\'s Mark'],
                epic: ['Omniscope', 'Stellar Viewer', 'Infinite Gaze'],
                legendary: ['Eye of the Gods', 'Universe Scanner', 'Cosmic Vision']
            },
            attackSpeed: {
                common: ['Quick Draw', 'Swift Strike', 'Rapid Fire'],
                rare: ['Lightning Bolt', 'Tempest Core', 'Storm Engine'],
                epic: ['Time Warp', 'Chrono Trigger', 'Velocity Master'],
                legendary: ['Bullet Time', 'Infinity Rush', 'Temporal Overdrive']
            },
            all: {
                legendary: ['Perfect Harmony', 'Master\'s Touch', 'Omnipotence']
            }
        };

        const stat = effect.targetStat === 'all' ? 'all' : effect.targetStat;
        const rarity = effect.rarity;
        const names = nameTemplates[stat]?.[rarity] || ['Mysterious Artifact'];
        
        return names[Math.floor(Math.random() * names.length)];
    }

    static getBossDropChance() {
        return 0.3; // 30% chance for boss to drop an item
    }

    static getEliteDropChance() {
        return 0.07; // 7% chance for elite enemies to drop items
    }
}