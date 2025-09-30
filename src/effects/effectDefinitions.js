// src/effects/effectDefinitions.js

export const effects = {
    // Damage effects
    DMG_10_PERCENT: {
        id: 'DMG_10_PERCENT',
        description: 'Increases tower damage by 10%',
        targetStat: 'damage',
        modifier: 'percentage',
        value: 0.10,
        rarity: 'common',
    },
    DMG_25_PERCENT: {
        id: 'DMG_25_PERCENT',
        description: 'Increases tower damage by 25%',
        targetStat: 'damage',
        modifier: 'percentage',
        value: 0.25,
        rarity: 'rare',
    },
    DMG_5_FLAT: {
        id: 'DMG_5_FLAT',
        description: 'Increases tower damage by 5',
        targetStat: 'damage',
        modifier: 'flat',
        value: 5,
        rarity: 'common',
    },
    DMG_15_FLAT: {
        id: 'DMG_15_FLAT',
        description: 'Increases tower damage by 15',
        targetStat: 'damage',
        modifier: 'flat',
        value: 15,
        rarity: 'rare',
    },

    // Range effects
    RANGE_10_PERCENT: {
        id: 'RANGE_10_PERCENT',
        description: 'Increases tower range by 10%',
        targetStat: 'range',
        modifier: 'percentage',
        value: 0.10,
        rarity: 'common',
    },
    RANGE_30_PERCENT: {
        id: 'RANGE_30_PERCENT',
        description: 'Increases tower range by 30%',
        targetStat: 'range',
        modifier: 'percentage',
        value: 0.30,
        rarity: 'epic',
    },
    RANGE_20_FLAT: {
        id: 'RANGE_20_FLAT',
        description: 'Increases tower range by 20',
        targetStat: 'range',
        modifier: 'flat',
        value: 20,
        rarity: 'common',
    },

    // Attack speed effects
    SPEED_10_PERCENT: {
        id: 'SPEED_10_PERCENT',
        description: 'Increases tower attack speed by 10%',
        targetStat: 'attackSpeed',
        modifier: 'percentage',
        value: 0.10,
        rarity: 'common',
    },
    SPEED_20_PERCENT: {
        id: 'SPEED_20_PERCENT',
        description: 'Increases tower attack speed by 20%',
        targetStat: 'attackSpeed',
        modifier: 'percentage',
        value: 0.20,
        rarity: 'rare',
    },
    SPEED_50_PERCENT: {
        id: 'SPEED_50_PERCENT',
        description: 'Increases tower attack speed by 50%',
        targetStat: 'attackSpeed',
        modifier: 'percentage',
        value: 0.50,
        rarity: 'legendary',
    },

    // Legendary combination effects
    BERSERKER_RAGE: {
        id: 'BERSERKER_RAGE',
        description: 'Increases damage by 40% but reduces range by 20%',
        targetStat: 'damage',
        modifier: 'percentage',
        value: 0.40,
        rarity: 'legendary',
        negativeEffect: {
            targetStat: 'range',
            modifier: 'percentage',
            value: -0.20,
        },
    },
    SNIPER_SCOPE: {
        id: 'SNIPER_SCOPE',
        description: 'Increases range by 60% but reduces attack speed by 30%',
        targetStat: 'range',
        modifier: 'percentage',
        value: 0.60,
        rarity: 'legendary',
        negativeEffect: {
            targetStat: 'attackSpeed',
            modifier: 'percentage',
            value: -0.30,
        },
    },
    PERFECT_BALANCE: {
        id: 'PERFECT_BALANCE',
        description: 'Increases all stats by 15%',
        targetStat: 'all',
        modifier: 'percentage',
        value: 0.15,
        rarity: 'legendary',
    },
};

export const rarityColors = {
    common: '#ffffff',
    rare: '#0099ff',
    epic: '#9933ff',
    legendary: '#ff9900',
};

export const rarityWeights = {
    common: 60,
    rare: 25,
    epic: 12,
    legendary: 3,
};
