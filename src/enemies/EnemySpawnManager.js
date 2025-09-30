// src/enemies/EnemySpawnManager.js

export default class EnemySpawnManager {
    constructor(gameWidth, gameHeight, seed = null) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.seed = seed || Math.floor(Math.random() * 1000000);
        this.rng = this.createSeededRNG(this.seed);
        
        // Define spawn zones (excluding bottom area)
        this.spawnZones = [
            { name: 'left', x: 0, y: 0, width: 50, height: gameHeight * 0.8 },
            { name: 'top', x: 0, y: 0, width: gameWidth, height: 50 },
            { name: 'right', x: gameWidth - 50, y: 0, width: 50, height: gameHeight * 0.8 },
            { name: 'top-left', x: 0, y: 0, width: gameWidth * 0.3, height: gameHeight * 0.3 },
            { name: 'top-right', x: gameWidth * 0.7, y: 0, width: gameWidth * 0.3, height: gameHeight * 0.3 }
        ];
    }

    createSeededRNG(seed) {
        return function() {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        };
    }

    setSeed(newSeed) {
        this.seed = newSeed;
        this.rng = this.createSeededRNG(this.seed);
    }

    getSeed() {
        return this.seed;
    }

    // Get a random spawn zone weighted by wave number
    getSpawnZone(waveNumber) {
        // Early waves: prefer left and top
        // Later waves: use all zones including corners
        let availableZones = [];
        
        if (waveNumber <= 5) {
            availableZones = this.spawnZones.filter(zone => 
                zone.name === 'left' || zone.name === 'top'
            );
        } else if (waveNumber <= 15) {
            availableZones = this.spawnZones.filter(zone => 
                zone.name === 'left' || zone.name === 'top' || zone.name === 'right'
            );
        } else {
            availableZones = this.spawnZones;
        }

        const randomIndex = Math.floor(this.rng() * availableZones.length);
        return availableZones[randomIndex];
    }

    // Generate spawn positions in a cone formation
    generateConeSpawnPositions(enemyCount, waveNumber, towerX, towerY) {
        const spawnZone = this.getSpawnZone(waveNumber);
        const positions = [];
        
        // Calculate cone parameters
        const coneAngle = Math.PI / 3; // 60 degrees
        const minDistance = 100;
        const maxDistance = 300;
        
        // Get base spawn position in the zone
        const baseX = spawnZone.x + this.rng() * spawnZone.width;
        const baseY = spawnZone.y + this.rng() * spawnZone.height;
        
        // Calculate direction towards tower
        const directionToTower = Math.atan2(towerY - baseY, towerX - baseX);
        
        // Generate positions in cone formation
        for (let i = 0; i < enemyCount; i++) {
            let spawnX, spawnY;
            let attempts = 0;
            const maxAttempts = 20;
            
            do {
                // Random angle within cone
                const angleOffset = (this.rng() - 0.5) * coneAngle;
                const spawnAngle = directionToTower + angleOffset + Math.PI; // +PI to spawn away from tower
                
                // Random distance
                const distance = minDistance + this.rng() * (maxDistance - minDistance);
                
                // Calculate spawn position
                spawnX = baseX + Math.cos(spawnAngle) * distance;
                spawnY = baseY + Math.sin(spawnAngle) * distance;
                
                // Ensure spawn is within game bounds and not at bottom
                spawnX = Math.max(0, Math.min(this.gameWidth, spawnX));
                spawnY = Math.max(0, Math.min(this.gameHeight * 0.8, spawnY));
                
                attempts++;
            } while (attempts < maxAttempts && this.isPositionTooCloseToOthers(spawnX, spawnY, positions, 30));
            
            positions.push({ 
                x: spawnX, 
                y: spawnY, 
                zone: spawnZone.name,
                delay: i * 0.2 // Stagger spawning
            });
        }
        
        return positions;
    }

    // Check if position is too close to existing positions
    isPositionTooCloseToOthers(x, y, existingPositions, minDistance) {
        return existingPositions.some(pos => {
            const distance = Math.sqrt((pos.x - x) ** 2 + (pos.y - y) ** 2);
            return distance < minDistance;
        });
    }

    // Generate spawn positions for a specific zone (for manual control)
    generateZoneSpawnPositions(zoneName, enemyCount, towerX, towerY) {
        const spawnZone = this.spawnZones.find(zone => zone.name === zoneName);
        if (!spawnZone) {
            console.warn(`Spawn zone '${zoneName}' not found`);
            return this.generateConeSpawnPositions(enemyCount, 1, towerX, towerY);
        }

        const positions = [];
        const spacing = Math.min(spawnZone.width, spawnZone.height) / Math.sqrt(enemyCount);

        for (let i = 0; i < enemyCount; i++) {
            const spawnX = spawnZone.x + (this.rng() * spawnZone.width);
            const spawnY = spawnZone.y + (this.rng() * spawnZone.height);
            
            positions.push({ 
                x: spawnX, 
                y: spawnY, 
                zone: zoneName,
                delay: i * 0.15
            });
        }

        return positions;
    }

    // Visualize spawn zones (for debugging)
    drawSpawnZones(ctx) {
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.lineWidth = 2;
        
        this.spawnZones.forEach(zone => {
            ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);
            
            // Label the zone
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.font = '12px Arial';
            ctx.fillText(zone.name, zone.x + 5, zone.y + 15);
        });
    }
}