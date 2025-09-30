// This file will handle the logic for the game page (game.html)
import Game from './game/Game.js';
import Inventory from './inventory/Inventory.js';
import './../css/main.css';
import { config } from './config.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 1600;
canvas.height = 900;

// Get seed from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const seed = urlParams.get('seed');
const gameSeed = seed ? parseInt(seed) : null;

let game = new Game(canvas.width, canvas.height, gameSeed);
const inventory = new Inventory();

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

function updateActiveInventoryUI() {
    const inventorySlots = document.getElementById('inventory-slots');
    inventorySlots.innerHTML = '';
    inventory.activeItems.forEach(item => {
        const slotEl = document.createElement('div');
        slotEl.classList.add('inventory-slot');
        let tooltipTimer;

        if (item) {
            slotEl.textContent = item.name.substring(0, 3);
            const tooltip = document.createElement('span');
            tooltip.classList.add('tooltip');
            tooltip.textContent = `${item.name}: ${item.description}`;
            slotEl.appendChild(tooltip);

            slotEl.addEventListener('mouseenter', () => {
                tooltipTimer = setTimeout(() => {
                    tooltip.classList.add('visible');
                }, 370);
            });

            slotEl.addEventListener('mouseleave', () => {
                clearTimeout(tooltipTimer);
                tooltip.classList.remove('visible');
            });

        } else {
            slotEl.classList.add('empty-slot');
        }
        inventorySlots.appendChild(slotEl);
    });
}

// Initial UI setup
game.ui.draw();
updateActiveInventoryUI();

const speedButton = document.getElementById('speed-control-button');
const speedLevels = [1, 1.5, 2];
let currentSpeedIndex = 0;

speedButton.addEventListener('click', (e) => {
    currentSpeedIndex = (currentSpeedIndex + 1) % speedLevels.length;
    const newSpeed = speedLevels[currentSpeedIndex];
    game.setSpeed(newSpeed);
    speedButton.textContent = `x${newSpeed}`;
    e.currentTarget.blur();
});

document.getElementById('restart-button').addEventListener('click', (e) => {
    // Create new game instance with same seed to keep background consistent
    game = new Game(canvas.width, canvas.height, gameSeed);
    document.getElementById('game-seed').textContent = game.seed;
    isPaused = false;
    // The overlay is now hidden by game.restart() -> gameOverScreen.hide()
    speedButton.textContent = 'x1';
    currentSpeedIndex = 0;
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
    e.currentTarget.blur();
});

document.getElementById('restart-button-top').addEventListener('click', (e) => {
    // Create new game instance with same seed to keep background consistent
    game = new Game(canvas.width, canvas.height, gameSeed);
    document.getElementById('game-seed').textContent = game.seed;
    isPaused = false;
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
            game.buffSystem = new (game.buffSystem.constructor)(game.inventory.activeItems);
        }
    }
    e.currentTarget.blur();
});

document.getElementById('upgrade-speed').addEventListener('click', (e) => {
    const upgradeCost = game.tower.speedCost;
    if (game.gold >= upgradeCost) {
        game.gold = game.tower.upgradeSpeed(game.gold);
        if (game.buffSystem && game.inventory) {
            game.buffSystem = new (game.buffSystem.constructor)(game.inventory.activeItems);
        }
    }
    e.currentTarget.blur();
});

document.getElementById('upgrade-damage').addEventListener('click', (e) => {
    const upgradeCost = game.tower.damageCost;
    if (game.gold >= upgradeCost) {
        game.gold = game.tower.upgradeDamage(game.gold);
        if (game.buffSystem && game.inventory) {
            game.buffSystem = new (game.buffSystem.constructor)(game.inventory.activeItems);
        }
    }
    e.currentTarget.blur();
});

function togglePause() {
    isPaused = !isPaused;
    if (!isPaused) {
        lastTime = performance.now();
    }
    document.getElementById('pause-overlay').style.display = isPaused ? 'flex' : 'none';
}

document.getElementById('pause-button-emoji').addEventListener('click', (e) => {
    togglePause();
    e.currentTarget.blur();
});
document.getElementById('pause-overlay').addEventListener('click', togglePause);

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        togglePause();
    }
});

// Start the game loop
lastTime = performance.now();
requestAnimationFrame(gameLoop);
