// This file will handle the logic for the main menu (index.html)
import Inventory from './inventory/Inventory.js';
import './../style.css';

const inventory = new Inventory();

function displayActiveItems() {
    const activeItemsDisplay = document.getElementById('active-items-display');
    activeItemsDisplay.innerHTML = ''; // Clear previous items

    for (let i = 0; i < inventory.activeItemSlots; i++) {
        const item = inventory.activeItems[i];
        const itemEl = document.createElement('div');
        itemEl.classList.add('inventory-slot');

        if (item) {
            itemEl.textContent = item.name.substring(0, 3);
            const tooltip = document.createElement('span');
            tooltip.classList.add('tooltip');
            tooltip.textContent = `${item.name}: ${item.description}`;
            itemEl.appendChild(tooltip);

            itemEl.addEventListener('mouseenter', () => {
                tooltip.classList.add('visible');
            });

            itemEl.addEventListener('mouseleave', () => {
                tooltip.classList.remove('visible');
            });

        } else {
            itemEl.classList.add('empty-slot');
        }
        activeItemsDisplay.appendChild(itemEl);
    }
}

// Handle seed input and game start
function setupGameStart() {
    const startGameLink = document.getElementById('start-game-link');
    const startBlitzLink = document.getElementById('start-blitz-link');
    const seedInput = document.getElementById('seed-input');
    
    // Classic Mode
    startGameLink.addEventListener('click', (e) => {
        e.preventDefault();
        
        let gameUrl = '/game.html';
        const seedValue = seedInput.value.trim();
        
        if (seedValue && !isNaN(seedValue)) {
            gameUrl += `?seed=${encodeURIComponent(seedValue)}`;
        }
        
        window.location.href = gameUrl;
    });
    
    // Blitz Mode
    startBlitzLink.addEventListener('click', (e) => {
        e.preventDefault();
        
        let gameUrl = '/blitz.html';
        const seedValue = seedInput.value.trim();
        
        if (seedValue && !isNaN(seedValue)) {
            gameUrl += `?seed=${encodeURIComponent(seedValue)}`;
        }
        
        window.location.href = gameUrl;
    });
    
    // Allow Enter key to start classic game
    seedInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            startGameLink.click();
        }
    });
}

displayActiveItems();
setupGameStart();
