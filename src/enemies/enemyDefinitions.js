// src/enemies/enemyDefinitions.js

export const enemyDefinitions = {
    basic: {
        name: "Basic Enemy",
        hp: 30,
        speed: 30,
        goldReward: 5,
        color: '#ff4444',
        size: 15,
        weight: 70, // Higher weight = more common
        minWave: 1,
        maxWave: 20
    },
    
    fast: {
        name: "Fast Enemy",
        hp: 20,
        speed: 60,
        goldReward: 8,
        color: '#44ff44',
        size: 12,
        weight: 50,
        minWave: 2,
        maxWave: 25
    },
    
    tank: {
        name: "Tank Enemy",
        hp: 80,
        speed: 15,
        goldReward: 15,
        color: '#4444ff',
        size: 20,
        weight: 30,
        minWave: 3,
        maxWave: 30
    },
    
    heavy: {
        name: "Heavy Enemy",
        hp: 120,
        speed: 25,
        goldReward: 20,
        color: '#ff8844',
        size: 18,
        weight: 20,
        minWave: 5,
        maxWave: 35
    },
    
    armored: {
        name: "Armored Enemy",
        hp: 150,
        speed: 20,
        goldReward: 25,
        color: '#8844ff',
        size: 22,
        weight: 15,
        minWave: 7,
        maxWave: 40
    },
    
    berserker: {
        name: "Berserker",
        hp: 60,
        speed: 45,
        goldReward: 18,
        color: '#ff4488',
        size: 16,
        weight: 25,
        minWave: 6,
        maxWave: 30
    },
    
    elite: {
        name: "Elite Warrior",
        hp: 200,
        speed: 35,
        goldReward: 35,
        color: '#ffaa44',
        size: 24,
        weight: 10,
        minWave: 10,
        maxWave: 50
    },
    
    destroyer: {
        name: "Destroyer",
        hp: 300,
        speed: 30,
        goldReward: 50,
        color: '#aa44ff',
        size: 26,
        weight: 8,
        minWave: 15,
        maxWave: 60
    },
    
    nightmare: {
        name: "Nightmare",
        hp: 250,
        speed: 50,
        goldReward: 45,
        color: '#ff44aa',
        size: 20,
        weight: 6,
        minWave: 18,
        maxWave: 65
    },
    
    titan: {
        name: "Titan",
        hp: 500,
        speed: 20,
        goldReward: 80,
        color: '#44aaff',
        size: 30,
        weight: 5,
        minWave: 25,
        maxWave: 100
    }
};

// Boss definitions - special enemies that appear less frequently
export const bossDefinitions = {
    megaTank: {
        name: "Mega Tank",
        hp: 600,
        speed: 18,
        goldReward: 150,
        color: '#ff0000',
        size: 35,
        weight: 40,
        minWave: 10,
        maxWave: 100,
        special: "Extremely high HP and damage resistance"
    },
    
    speedDemon: {
        name: "Speed Demon",
        hp: 300,
        speed: 80,
        goldReward: 120,
        color: '#00ff00',
        size: 25,
        weight: 35,
        minWave: 12,
        maxWave: 100,
        special: "Incredibly fast movement"
    },
    
    shadowLord: {
        name: "Shadow Lord",
        hp: 800,
        speed: 25,
        goldReward: 200,
        color: '#8800ff',
        size: 40,
        weight: 25,
        minWave: 20,
        maxWave: 100,
        special: "Massive HP and intimidating presence"
    },
    
    voidBringer: {
        name: "Void Bringer",
        hp: 1000,
        speed: 30,
        goldReward: 300,
        color: '#000088',
        size: 45,
        weight: 15,
        minWave: 30,
        maxWave: 100,
        special: "Ultimate boss with devastating power"
    }
};

// Elite modifiers - these modify base enemies
export const eliteModifiers = {
    reinforced: {
        name: "Reinforced",
        hpMultiplier: 1.5,
        speedMultiplier: 1.0,
        goldMultiplier: 1.8,
        color: '#ffaa00',
        glowColor: '#ffaa00'
    },
    
    swift: {
        name: "Swift",
        hpMultiplier: 1.2,
        speedMultiplier: 1.4,
        goldMultiplier: 1.6,
        color: '#00aaff',
        glowColor: '#00aaff'
    },
    
    brutal: {
        name: "Brutal",
        hpMultiplier: 1.8,
        speedMultiplier: 0.9,
        goldMultiplier: 2.2,
        color: '#aa0000',
        glowColor: '#aa0000'
    },
    
    blessed: {
        name: "Blessed",
        hpMultiplier: 1.3,
        speedMultiplier: 1.2,
        goldMultiplier: 2.0,
        color: '#ffffff',
        glowColor: '#ffffff'
    }
};

// Wave composition helpers
export const waveCompositions = {
    early: {
        minWave: 1,
        maxWave: 5,
        enemyTypes: ['basic', 'fast'],
        maxEnemies: 8,
        bossChance: 0,
        eliteChance: 0.05
    },
    
    mid: {
        minWave: 6,
        maxWave: 15,
        enemyTypes: ['basic', 'fast', 'tank', 'heavy'],
        maxEnemies: 12,
        bossChance: 0.1,
        eliteChance: 0.15
    },
    
    late: {
        minWave: 16,
        maxWave: 30,
        enemyTypes: ['fast', 'tank', 'heavy', 'armored', 'berserker', 'elite'],
        maxEnemies: 15,
        bossChance: 0.2,
        eliteChance: 0.25
    },
    
    endgame: {
        minWave: 31,
        maxWave: 100,
        enemyTypes: ['heavy', 'armored', 'berserker', 'elite', 'destroyer', 'nightmare', 'titan'],
        maxEnemies: 20,
        bossChance: 0.3,
        eliteChance: 0.35
    }
};