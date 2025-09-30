import Inventory from './inventory/Inventory.js';
import './../style.css';

const inventory = new Inventory();

const activeItemsGrid = document.getElementById('active-items-grid');
const mainInventoryGrid = document.getElementById('main-inventory-grid');
const deleteZone = document.getElementById('delete-zone');

function createItemElement(item, index, type) {
    const itemEl = document.createElement('div');
    itemEl.classList.add('inventory-slot');
    itemEl.draggable = true;
    itemEl.dataset.itemId = item ? item.id : 'empty';
    itemEl.dataset.index = index;
    itemEl.dataset.type = type;

    if (item) {
        itemEl.textContent = item.name.substring(0, 3);
        const tooltip = document.createElement('span');
        tooltip.classList.add('tooltip');
        tooltip.textContent = `${item.name}: ${item.description}`;
        itemEl.appendChild(tooltip);
    } else {
        itemEl.classList.add('empty-slot');
    }
    return itemEl;
}

function renderInventories() {
    activeItemsGrid.innerHTML = '';
    mainInventoryGrid.innerHTML = '';

    // Render active items
    for (let i = 0; i < inventory.activeItemSlots; i++) {
        const item = inventory.activeItems[i];
        const itemEl = createItemElement(item, i, 'active');
        activeItemsGrid.appendChild(itemEl);
    }

    // Render main inventory
    inventory.items.forEach((item, index) => {
        const itemEl = createItemElement(item, index, 'main');
        mainInventoryGrid.appendChild(itemEl);
    });
}

// Drag and Drop Logic
let draggedItem = null;

document.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('inventory-slot')) {
        draggedItem = e.target;
        setTimeout(() => {
            e.target.style.opacity = '0.5';
        }, 0);
    }
});

document.addEventListener('dragend', (e) => {
    if (draggedItem) {
        draggedItem.style.opacity = '1';
        draggedItem = null;
    }
    deleteZone.classList.remove('active');
});

document.addEventListener('dragover', (e) => {
    e.preventDefault();
});

document.addEventListener('drop', (e) => {
    e.preventDefault();
    if (!draggedItem) return;

    const targetSlot = e.target.closest('.inventory-slot');
    if (targetSlot) {
        const fromId = draggedItem.dataset.itemId;
        const fromType = draggedItem.dataset.type;
        const fromIndex = parseInt(draggedItem.dataset.index, 10);

        const toId = targetSlot.dataset.itemId;
        const toType = targetSlot.dataset.type;
        const toIndex = parseInt(targetSlot.dataset.index, 10);

        if (fromId === 'empty') return; // Cannot drag an empty slot

        // Logic for moving items
        if (fromType === 'main' && toType === 'active') {
            inventory.equipItem(fromIndex, toIndex);
        } else if (fromType === 'active' && toType === 'main') {
            inventory.unequipItem(fromIndex, toIndex);
        } else if (fromType === 'active' && toType === 'active') {
            inventory.swapActiveItems(fromIndex, toIndex);
        } else if (fromType === 'main' && toType === 'main') {
            inventory.swapItems(fromIndex, toIndex);
        }

        renderInventories();
    }
});

// Delete Zone Logic
deleteZone.addEventListener('dragenter', (e) => {
    e.preventDefault();
    if (draggedItem) {
        deleteZone.classList.add('active');
    }
});

deleteZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    deleteZone.classList.remove('active');
});

deleteZone.addEventListener('dragover', (e) => {
    e.preventDefault(); // Necessary to allow drop
});

deleteZone.addEventListener('drop', (e) => {
    e.preventDefault();
    if (draggedItem) {
        const fromType = draggedItem.dataset.type;
        const fromIndex = parseInt(draggedItem.dataset.index, 10);
        inventory.deleteItem(fromType, fromIndex);
        renderInventories();
    }
    deleteZone.classList.remove('active');
});


renderInventories();
