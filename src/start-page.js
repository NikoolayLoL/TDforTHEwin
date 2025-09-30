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
        } else {
            itemEl.classList.add('empty-slot');
        }
        activeItemsDisplay.appendChild(itemEl);
    }
}

displayActiveItems();
