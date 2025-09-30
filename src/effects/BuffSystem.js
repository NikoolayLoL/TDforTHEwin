// src/effects/BuffSystem.js
import { effects as effectDefinitions } from './effectDefinitions.js';

export default class BuffSystem {
    constructor(activeItems = []) {
        this.activeEffects = this.extractEffects(activeItems);
    }

    extractEffects(activeItems) {
        return activeItems
            .filter(item => item && item.effectId)
            .map(item => effectDefinitions[item.effectId])
            .filter(effect => effect); // Ensure the effect exists
    }

    getAggregatedBuffs() {
        const aggregated = {
            damage: { percentage: 0, flat: 0 },
            range: { percentage: 0, flat: 0 },
            attackSpeed: { percentage: 0, flat: 0 },
        };

        for (const effect of this.activeEffects) {
            if (effect.targetStat === 'all') {
                // Special case for effects that affect all stats
                aggregated.damage[effect.modifier] += effect.value;
                aggregated.range[effect.modifier] += effect.value;
                aggregated.attackSpeed[effect.modifier] += effect.value;
            } else if (aggregated[effect.targetStat]) {
                aggregated[effect.targetStat][effect.modifier] += effect.value;
            }

            // Handle negative effects (for legendary items with trade-offs)
            if (effect.negativeEffect && aggregated[effect.negativeEffect.targetStat]) {
                aggregated[effect.negativeEffect.targetStat][effect.negativeEffect.modifier] += effect.negativeEffect.value;
            }
        }

        return aggregated;
    }
}
