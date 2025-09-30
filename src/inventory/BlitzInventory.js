// src/inventory/BlitzInventory.js
import Item from './Item.js';
import { effects } from '../effects/effectDefinitions.js';
import BuffSystem from '../effects/BuffSystem.js';

const BLITZ_INVENTORY_SIZE = 5;

export default class BlitzInventory {
    constructor() {
        this.items = new Array(BLITZ_INVENTORY_SIZE).fill(null);
        this.maxNotifications = 4; // Limit to 4 notifications
        this.lastRenderHash = ''; // Track when we need to re-render
        this.setupNotificationSystem();
        
        // Render initial UI after a brief delay to ensure DOM is ready
        setTimeout(() => this.renderUI(), 100);
    }

    // Setup the notification system UI
    setupNotificationSystem() {
        // Create notification container if it doesn't exist
        let container = document.getElementById('blitz-notifications');
        if (!container) {
            container = document.createElement('div');
            container.id = 'blitz-notifications';
            document.body.appendChild(container);
        }
    }

    // Check if inventory has space
    hasSpace() {
        return this.items.some(slot => slot === null);
    }

    // Get empty slot index
    getEmptySlotIndex() {
        return this.items.findIndex(slot => slot === null);
    }

    // Add item directly (if there's space)
    addItem(item) {
        const emptySlot = this.getEmptySlotIndex();
        if (emptySlot !== -1) {
            this.items[emptySlot] = item;
            return true;
        }
        return false; // No space
    }

    // Replace item at specific index
    replaceItem(index, newItem) {
        if (index >= 0 && index < this.items.length) {
            const oldItem = this.items[index];
            this.items[index] = newItem;
            return oldItem;
        }
        return null;
    }

    // Remove item at index
    removeItem(index) {
        if (index >= 0 && index < this.items.length) {
            const removedItem = this.items[index];
            this.items[index] = null;
            return removedItem;
        }
        return null;
    }

    // Find item with same effect type for auto-upgrade
    findSimilarItem(newItem) {
        if (!newItem.effectId || !effects[newItem.effectId]) return null;

        const newEffect = effects[newItem.effectId];
        
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            if (!item || !item.effectId || !effects[item.effectId]) continue;

            const existingEffect = effects[item.effectId];
            
            // Check if same targetStat and modifier
            if (existingEffect.targetStat === newEffect.targetStat && 
                existingEffect.modifier === newEffect.modifier) {
                return { index: i, item: item, effect: existingEffect };
            }
        }
        
        return null;
    }

    // Calculate effective value of an effect (for comparison)
    getEffectiveValue(effect) {
        if (effect.modifier === 'percentage') {
            return effect.value; // percentage values can be compared directly
        } else {
            return effect.value; // flat values can also be compared directly
        }
    }

    // Attempt to add item with auto-upgrade logic
    tryAddItemWithAutoUpgrade(newItem) {
        // First check if there's a similar item that can be upgraded
        const similarItem = this.findSimilarItem(newItem);
        
        if (similarItem && effects[newItem.effectId]) {
            const newEffect = effects[newItem.effectId];
            const existingEffect = similarItem.effect;
            
            // Check if new item is better
            if (this.getEffectiveValue(newEffect) > this.getEffectiveValue(existingEffect)) {
                // Replace with better item
                const replacedItem = this.replaceItem(similarItem.index, newItem);
                this.showNotification(newItem, 'upgraded', replacedItem);
                this.lastRenderHash = ''; // Force re-render
                this.renderUI();
                return { success: true, action: 'upgraded', replacedItem };
            } else {
                // New item is worse, show notification but don't add
                this.showNotification(newItem, 'rejected_worse');
                return { success: false, action: 'rejected_worse' };
            }
        }
        
        // No similar item found, try to add normally
        if (this.hasSpace()) {
            const added = this.addItem(newItem);
            if (added) {
                this.showNotification(newItem, 'added');
                this.lastRenderHash = ''; // Force re-render
                this.renderUI();
                return { success: true, action: 'added' };
            }
        }
        
        // Inventory full and no upgrades available
        this.showNotification(newItem, 'rejected_full');
        return { success: false, action: 'rejected_full' };
    }

    // Show notification for item action
    showNotification(item, action, replacedItem = null) {
        const container = document.getElementById('blitz-notifications');
        if (!container) return;

        // Remove oldest notification if we have too many
        const existingNotifications = container.children;
        if (existingNotifications.length >= this.maxNotifications) {
            // Remove the oldest (first) notification
            if (existingNotifications[0]) {
                existingNotifications[0].style.animation = 'slideOutToRight 0.3s ease-in';
                setTimeout(() => {
                    if (existingNotifications[0] && existingNotifications[0].parentNode) {
                        existingNotifications[0].parentNode.removeChild(existingNotifications[0]);
                    }
                }, 300);
            }
        }

        const notification = document.createElement('div');
        notification.style.borderColor = this.getRarityColor(item);

        let content = '';
        let cssClass = 'blitz-notification';

        switch (action) {
            case 'added':
                cssClass += ' added';
                content = `
                    <div class="notification-header added">✓ ITEM ADDED</div>
                    <div class="notification-item-name" style="color: ${this.getRarityColor(item)};">${item.name}</div>
                    <div class="notification-description">${item.description}</div>
                `;
                break;
            
            case 'upgraded':
                cssClass += ' upgraded';
                content = `
                    <div class="notification-header upgraded">⬆ ITEM UPGRADED</div>
                    <div class="notification-item-name" style="color: ${this.getRarityColor(item)};">${item.name}</div>
                    <div class="notification-description">Replaced: ${replacedItem?.name || 'Unknown'}</div>
                `;
                break;
            
            case 'rejected_worse':
                cssClass += ' rejected';
                content = `
                    <div class="notification-header rejected">⚠ ITEM REJECTED</div>
                    <div class="notification-item-name" style="color: ${this.getRarityColor(item)};">${item.name}</div>
                    <div class="notification-description">You have a better version</div>
                `;
                break;
            
            case 'rejected_full':
                cssClass += ' inventory-full';
                content = `
                    <div class="notification-header inventory-full">✕ INVENTORY FULL</div>
                    <div class="notification-item-name" style="color: ${this.getRarityColor(item)};">${item.name}</div>
                    <div class="notification-description">No upgrade available</div>
                `;
                break;
        }

        notification.className = cssClass;
        notification.innerHTML = content;
        container.appendChild(notification);

        // Auto-remove after 4 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutToRight 0.3s ease-in';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 4000);
    }

    // Get rarity color for item display
    getRarityColor(item) {
        if (item.effectId && effects[item.effectId]) {
            const effect = effects[item.effectId];
            const rarityColors = {
                'common': '#ffffff',
                'rare': '#4a90e2',
                'epic': '#9b59b6',
                'legendary': '#f39c12'
            };
            return rarityColors[effect.rarity] || '#ffffff';
        }
        return '#ffffff';
    }

    // Render the blitz inventory UI
    renderUI() {
        // Create a hash of current items to detect changes
        const currentHash = this.items.map(item => item ? item.id : 'null').join(',');
        if (currentHash === this.lastRenderHash) {
            return; // No need to re-render if nothing changed
        }
        this.lastRenderHash = currentHash;
        
        console.log('BlitzInventory renderUI called, items:', this.items);
        const slotsContainer = document.getElementById('blitz-inventory-slots');
        if (!slotsContainer) {
            console.log('blitz-inventory-slots container not found!');
            return;
        }

        slotsContainer.innerHTML = '';

        this.items.forEach((item, index) => {
            const slotEl = document.createElement('div');
            slotEl.className = 'blitz-slot inventory-slot';
            slotEl.style.position = 'relative';
            
            if (item) {
                // Create main content area
                const contentDiv = document.createElement('div');
                contentDiv.className = 'blitz-inventory-content';
                contentDiv.textContent = item.name.substring(0, 3);
                contentDiv.style.cssText = `
                    background-color: ${this.getRarityColor(item)};
                    color: #000;
                    border: 2px solid ${this.getRarityColor(item)};
                `;
                
                // Create tooltip
                const tooltip = document.createElement('span');
                tooltip.className = 'tooltip';
                tooltip.textContent = `${item.name}: ${item.description}`;
                contentDiv.appendChild(tooltip);
                
                // Create permanent remove button (X)
                const removeBtn = document.createElement('button');
                removeBtn.className = 'blitz-remove-button';
                removeBtn.innerHTML = '×';
                removeBtn.title = 'Remove item';
                
                // Show tooltip on content hover
                contentDiv.addEventListener('mouseenter', () => {
                    tooltip.classList.add('visible');
                });
                
                contentDiv.addEventListener('mouseleave', () => {
                    tooltip.classList.remove('visible');
                });
                
                // Remove item functionality with debugging
                removeBtn.addEventListener('click', (e) => {
                    console.log('CLICK EVENT TRIGGERED!');
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(`Removing item at index ${index}:`, item.name);
                    console.log('Current items before removal:', this.items);
                    
                    const removedItem = this.removeItem(index);
                    console.log('Item removed:', removedItem);
                    console.log('Current items after removal:', this.items);
                    
                    // Update buff system after removal
                    if (window.game && window.game.buffSystem) {
                        window.game.buffSystem = new BuffSystem(this.getActiveItems());
                        console.log('Buff system updated with items:', this.getActiveItems());
                    } else {
                        console.log('No window.game or buffSystem found');
                    }
                    
                    // Force re-render by clearing hash
                    this.lastRenderHash = '';
                    this.renderUI();
                    console.log('UI re-rendered');
                });
                
                slotEl.appendChild(contentDiv);
                slotEl.appendChild(removeBtn);
            } else {
                slotEl.className += ' empty';
                slotEl.textContent = '+';
            }
            
            slotsContainer.appendChild(slotEl);
        });
    }

    // Get active items for buff system
    getActiveItems() {
        return this.items.filter(item => item !== null);
    }

    // Clear all items
    clear() {
        this.items.fill(null);
        this.renderUI();
    }
}

// Add CSS animations for notifications and tooltip styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInFromRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutToRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .blitz-slot {
        position: relative;
        overflow: visible;
    }
    
    .blitz-slot:hover {
        transform: scale(1.05);
        transition: transform 0.2s ease;
    }
    
    /* Hide remove buttons when game is paused */
    #pause-overlay:not([style*="display: none"]) ~ * .blitz-slot button,
    body:has(#pause-overlay:not([style*="display: none"])) .blitz-slot button {
        display: none !important;
    }
    
    .blitz-slot .tooltip,
    .inventory-slot .tooltip {
        visibility: hidden;
        width: 200px;
        background-color: rgba(0, 0, 0, 0.95);
        color: #fff;
        text-align: center;
        border-radius: 6px;
        padding: 8px;
        position: absolute;
        z-index: 1001;
        bottom: 130%;
        left: 50%;
        margin-left: -100px;
        opacity: 0;
        transition: opacity 0.3s ease;
        font-size: 12px;
        border: 1px solid #666;
        word-wrap: break-word;
        line-height: 1.4;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        pointer-events: none;
    }
    
    .blitz-slot .tooltip.visible,
    .inventory-slot .tooltip.visible {
        visibility: visible;
        opacity: 1;
    }
    
    .blitz-slot .tooltip.visible::after,
    .inventory-slot .tooltip.visible::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: rgba(0, 0, 0, 0.95) transparent transparent transparent;
    }
`;
document.head.appendChild(style);