import Game from './game/Game.js';
import './../style.css';
import { config } from './config.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 1600;
canvas.height = 900;

let game = new Game(canvas.width, canvas.height);

let isPaused = false;
let lastTime = 0;
const frameDuration = 1000 / config.fps;

function gameLoop(timestamp) {
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

// Pass game reference to tower and ui
game.tower.game = game;
game.ui.game = game;
game.ui.draw();

document.getElementById('upgrade-range').addEventListener('click', () => game.tower.upgradeRange());
document.getElementById('upgrade-speed').addEventListener('click', () => game.tower.upgradeSpeed());
document.getElementById('upgrade-damage').addEventListener('click', () => game.tower.upgradeDamage());

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
    document.getElementById('pause-overlay').style.display = 'none';
    speedButton.textContent = 'x1';
    currentSpeedIndex = 0; // Reset speed index
    e.currentTarget.blur();
});

document.getElementById('restart-button-top').addEventListener('click', (e) => {
    game.restart();
    isPaused = false;
    document.getElementById('pause-overlay').style.display = 'none';
    speedButton.textContent = 'x1';
    currentSpeedIndex = 0; // Reset speed index
    e.currentTarget.blur();
});

function togglePause() {
    isPaused = !isPaused;
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

requestAnimationFrame(gameLoop);
