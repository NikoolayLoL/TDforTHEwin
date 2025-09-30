// This file will handle the logic for the game page (game.html)
import Game from './game/Game.js';
import Inventory from './inventory/Inventory.js';
import './../style.css';
import { config } from './config.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 1600;
canvas.height = 900;

let game = new Game(canvas.width, canvas.height);
const inventory = new Inventory();

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
        if (item) {
            slotEl.textContent = item.name.substring(0, 3);
            const tooltip = document.createElement('span');
            tooltip.classList.add('tooltip');
            tooltip.textContent = `${item.name}: ${item.description}`;
            slotEl.appendChild(tooltip);
        }
        inventorySlots.appendChild(slotEl);
    });
}

// Initial UI setup
game.ui.draw();
updateActiveInventoryUI();

// Event Listeners
document.getElementById('upgrade-range').addEventListener('click', () => {
    game.gold = game.tower.upgradeRange(game.gold);
});
document.getElementById('upgrade-speed').addEventListener('click', () => {
    game.gold = game.tower.upgradeSpeed(game.gold);
});
document.getElementById('upgrade-damage').addEventListener('click', () => {
    game.gold = game.tower.upgradeDamage(game.gold);
});

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
    game.restart();
    isPaused = false;
    // The overlay is now hidden by game.restart() -> gameOverScreen.hide()
    speedButton.textContent = 'x1';
    currentSpeedIndex = 0;
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
    e.currentTarget.blur();
});

document.getElementById('restart-button-top').addEventListener('click', (e) => {
    game.restart();
    isPaused = false;
    speedButton.textContent = 'x1';
    currentSpeedIndex = 0;
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
