// This file will handle the logic for the blitz game page (blitz.html)
import BlitzGame from './game/BlitzGame.js';
import './../css/main.css';
import './../css/blitz.css';
import { config } from './config.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 1600;
canvas.height = 900;

// Get seed from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const seed = urlParams.get('seed');
const gameSeed = seed ? parseInt(seed) : null;

let game = new BlitzGame(canvas.width, canvas.height, gameSeed);

// Make game globally accessible for inventory interactions
window.game = game;

// Display the seed in the UI
document.getElementById('game-seed').textContent = game.seed;

let isPaused = false;
let lastTime = 0;
const frameDuration = 1000 / config.fps;

function gameLoop(timestamp) {
    if (game.isGameOver) {
        return; // Stop the loop if the game has ended
    }

    const deltaTime = timestamp - lastTime;

    if (!isPaused && deltaTime >= frameDuration) {
        lastTime = timestamp - (deltaTime % frameDuration);
        const dt = deltaTime / 1000; // Delta time in seconds

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(dt);
        game.draw(ctx);
    }
    requestAnimationFrame(gameLoop);
}

function updateUI() {
    document.getElementById('lives').textContent = game.lives;
    document.getElementById('gold').textContent = game.gold;
    document.getElementById('wave-number').textContent = game.waveManager.waveNumber;
}

// Start the game loop
requestAnimationFrame(gameLoop);

// Update UI every frame
setInterval(updateUI, frameDuration);

// Speed control
const speedButton = document.getElementById('speed-control-button');
const speeds = [1, 2, 3];
let currentSpeedIndex = 0;

speedButton.addEventListener('click', (e) => {
    currentSpeedIndex = (currentSpeedIndex + 1) % speeds.length;
    const newSpeed = speeds[currentSpeedIndex];
    game.setSpeed(newSpeed);
    speedButton.textContent = `x${newSpeed}`;
    e.currentTarget.blur();
});

// Pause/Resume functionality
const pauseButton = document.getElementById('pause-button-emoji');

function togglePause() {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? '▶️' : '⏸️';
    
    if (isPaused) {
        document.getElementById('pause-overlay').style.display = 'flex';
    } else {
        document.getElementById('pause-overlay').style.display = 'none';
        lastTime = performance.now(); // Reset lastTime to prevent large delta jumps
    }
}

pauseButton.addEventListener('click', (e) => {
    togglePause();
    e.currentTarget.blur();
});

// Add click listener to pause overlay for resume functionality
document.getElementById('pause-overlay').addEventListener('click', togglePause);

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        togglePause();
    }
});

// Restart functionality
document.getElementById('restart-button').addEventListener('click', (e) => {
    // Create new game instance with same seed to keep background consistent
    game = new BlitzGame(canvas.width, canvas.height, gameSeed);
    window.game = game; // Update global reference
    document.getElementById('game-seed').textContent = game.seed;
    isPaused = false;
    // Hide overlays
    document.getElementById('game-over-overlay').style.display = 'none';
    document.getElementById('pause-overlay').style.display = 'none';
    speedButton.textContent = 'x1';
    currentSpeedIndex = 0;
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
    e.currentTarget.blur();
});

document.getElementById('restart-button-top').addEventListener('click', (e) => {
    // Create new game instance with same seed to keep background consistent
    game = new BlitzGame(canvas.width, canvas.height, gameSeed);
    window.game = game; // Update global reference
    document.getElementById('game-seed').textContent = game.seed;
    isPaused = false;
    document.getElementById('pause-overlay').style.display = 'none';
    speedButton.textContent = 'x1';
    currentSpeedIndex = 0;
    e.currentTarget.blur();
});

// Tower upgrades
document.getElementById('upgrade-range').addEventListener('click', (e) => {
    const upgradeCost = game.tower.rangeCost;
    if (game.gold >= upgradeCost) {
        game.gold = game.tower.upgradeRange(game.gold);
        if (game.buffSystem && game.inventory) {
            game.buffSystem = new (game.buffSystem.constructor)(game.inventory.getActiveItems());
        }
        updateUI();
    }
    e.currentTarget.blur();
});

document.getElementById('upgrade-speed').addEventListener('click', (e) => {
    const upgradeCost = game.tower.speedCost;
    if (game.gold >= upgradeCost) {
        game.gold = game.tower.upgradeSpeed(game.gold);
        if (game.buffSystem && game.inventory) {
            game.buffSystem = new (game.buffSystem.constructor)(game.inventory.getActiveItems());
        }
        updateUI();
    }
    e.currentTarget.blur();
});

document.getElementById('upgrade-damage').addEventListener('click', (e) => {
    const upgradeCost = game.tower.damageCost;
    if (game.gold >= upgradeCost) {
        game.gold = game.tower.upgradeDamage(game.gold);
        if (game.buffSystem && game.inventory) {
            game.buffSystem = new (game.buffSystem.constructor)(game.inventory.getActiveItems());
        }
        updateUI();
    }
    e.currentTarget.blur();
});

// Update upgrade button costs
function updateUpgradeCosts() {
    const rangeCostElement = document.getElementById('upgrade-range-cost');
    const speedCostElement = document.getElementById('upgrade-speed-cost');
    const damageCostElement = document.getElementById('upgrade-damage-cost');

    if (rangeCostElement) {
        rangeCostElement.textContent = game.tower.rangeCost;
    }
    if (speedCostElement) {
        speedCostElement.textContent = game.tower.speedCost;
    }
    if (damageCostElement) {
        damageCostElement.textContent = game.tower.damageCost;
    }
}

// Update costs periodically
setInterval(updateUpgradeCosts, 100);

// Initial UI setup
updateUI();
updateUpgradeCosts();
game.inventory.renderUI();