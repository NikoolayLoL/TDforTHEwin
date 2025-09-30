// src/background/BackgroundGenerator.js

export default class BackgroundGenerator {
    constructor(seed = null) {
        this.seed = seed || this.generateSeed();
        this.rng = this.createSeededRNG(this.seed);
        this.canvas = null;
        this.ctx = null;
    }

    generateSeed() {
        return Math.floor(Math.random() * 1000000);
    }

    // Simple seeded random number generator
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

    generateBackground(width, height) {
        // Create off-screen canvas for background
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext('2d');

        // Choose background type based on seed
        const bgType = Math.floor(this.rng() * 4);
        
        switch(bgType) {
            case 0:
                this.generateGrasslandBackground(width, height);
                break;
            case 1:
                this.generateDesertBackground(width, height);
                break;
            case 2:
                this.generateSnowBackground(width, height);
                break;
            case 3:
                this.generateVolcanicBackground(width, height);
                break;
        }

        return this.canvas;
    }

    generateGrasslandBackground(width, height) {
        // Base grass color
        const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#7CB342');
        gradient.addColorStop(1, '#4CAF50');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, width, height);

        // Add grass texture
        this.ctx.fillStyle = 'rgba(56, 142, 60, 0.3)';
        for (let i = 0; i < 200; i++) {
            const x = this.rng() * width;
            const y = this.rng() * height;
            const size = 2 + this.rng() * 4;
            this.ctx.fillRect(x, y, 1, size);
        }

        // Add some flowers
        for (let i = 0; i < 15; i++) {
            const x = this.rng() * width;
            const y = this.rng() * height;
            const hue = this.rng() * 360;
            this.ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 2, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    generateDesertBackground(width, height) {
        // Base sand color
        const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#FFE0B2');
        gradient.addColorStop(1, '#FFCC02');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, width, height);

        // Add sand dunes
        this.ctx.fillStyle = 'rgba(255, 193, 7, 0.3)';
        for (let i = 0; i < 10; i++) {
            const x = this.rng() * width;
            const y = this.rng() * height;
            const radius = 30 + this.rng() * 80;
            this.ctx.beginPath();
            this.ctx.ellipse(x, y, radius, radius * 0.3, 0, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // Add rocks
        this.ctx.fillStyle = 'rgba(121, 85, 72, 0.6)';
        for (let i = 0; i < 25; i++) {
            const x = this.rng() * width;
            const y = this.rng() * height;
            const size = 3 + this.rng() * 8;
            this.ctx.fillRect(x, y, size, size * 0.7);
        }
    }

    generateSnowBackground(width, height) {
        // Base snow color
        const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#E3F2FD');
        gradient.addColorStop(1, '#BBDEFB');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, width, height);

        // Add snow patches
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        for (let i = 0; i < 30; i++) {
            const x = this.rng() * width;
            const y = this.rng() * height;
            const radius = 10 + this.rng() * 40;
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // Add ice crystals
        this.ctx.strokeStyle = 'rgba(179, 229, 252, 0.8)';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < 50; i++) {
            const x = this.rng() * width;
            const y = this.rng() * height;
            const size = 2 + this.rng() * 6;
            
            this.ctx.beginPath();
            this.ctx.moveTo(x - size, y);
            this.ctx.lineTo(x + size, y);
            this.ctx.moveTo(x, y - size);
            this.ctx.lineTo(x, y + size);
            this.ctx.moveTo(x - size * 0.7, y - size * 0.7);
            this.ctx.lineTo(x + size * 0.7, y + size * 0.7);
            this.ctx.moveTo(x - size * 0.7, y + size * 0.7);
            this.ctx.lineTo(x + size * 0.7, y - size * 0.7);
            this.ctx.stroke();
        }
    }

    generateVolcanicBackground(width, height) {
        // Base volcanic color
        const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#3E2723');
        gradient.addColorStop(1, '#5D4037');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, width, height);

        // Add lava streams
        this.ctx.fillStyle = 'rgba(255, 87, 34, 0.6)';
        for (let i = 0; i < 8; i++) {
            const startX = this.rng() * width;
            const startY = this.rng() * height * 0.3;
            const endX = startX + (this.rng() - 0.5) * 200;
            const endY = height;
            const width1 = 5 + this.rng() * 15;
            
            this.ctx.beginPath();
            this.ctx.moveTo(startX - width1/2, startY);
            this.ctx.quadraticCurveTo(
                startX + (endX - startX) * 0.5, 
                startY + (endY - startY) * 0.3,
                endX - width1/2, 
                endY
            );
            this.ctx.lineTo(endX + width1/2, endY);
            this.ctx.quadraticCurveTo(
                startX + (endX - startX) * 0.5, 
                startY + (endY - startY) * 0.3,
                startX + width1/2, 
                startY
            );
            this.ctx.closePath();
            this.ctx.fill();
        }

        // Add volcanic rocks
        this.ctx.fillStyle = 'rgba(33, 33, 33, 0.8)';
        for (let i = 0; i < 40; i++) {
            const x = this.rng() * width;
            const y = this.rng() * height;
            const size = 4 + this.rng() * 12;
            this.ctx.fillRect(x, y, size, size);
        }

        // Add glowing embers
        this.ctx.fillStyle = 'rgba(255, 152, 0, 0.7)';
        for (let i = 0; i < 20; i++) {
            const x = this.rng() * width;
            const y = this.rng() * height;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 1 + this.rng() * 2, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    draw(ctx, x = 0, y = 0) {
        if (this.canvas) {
            ctx.drawImage(this.canvas, x, y);
        }
    }
}