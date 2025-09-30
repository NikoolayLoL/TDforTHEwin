// src/inventory/Inventory.js
import Storage from './Storage.js';
import Item from './Item.js';

const INVENTORY_SIZE = 32;
const ACTIVE_ITEMS_SIZE = 5;

export default class Inventory {
    constructor() {
        this.storage = new Storage();
        this.items = new Array(INVENTORY_SIZE).fill(null);
        this.activeItemSlots = ACTIVE_ITEMS_SIZE;
        this.activeItems = new Array(this.activeItemSlots).fill(null);
        this.load();
    }

    load() {
        const savedInventory = this.storage.loadInventory();
        if (savedInventory && savedInventory.items && savedInventory.activeItems) {
            this.items = savedInventory.items.map(itemData => itemData ? new Item(itemData.name, itemData.description, itemData.effectId) : null);
            this.activeItems = savedInventory.activeItems.map(itemData => itemData ? new Item(itemData.name, itemData.description, itemData.effectId) : null);
        } 
        // else {
        //     // For testing, let's add some dummy items with effects
        //     this.items[0] = new Item('Power Crystal', 'Increases tower damage by 10%', 'DMG_10_PERCENT');
        //     this.items[1] = new Item('Range Finder', 'Increases tower range by 10%', 'RANGE_10_PERCENT');
        //     this.items[2] = new Item('Rapid Reloader', 'Increases tower attack speed by 10%', 'SPEED_10_PERCENT');
        //     this.items[3] = new Item('Iron Blade', 'Increases tower damage by 5', 'DMG_5_FLAT');
        //     this.items[4] = new Item('Scope', 'Increases tower range by 20', 'RANGE_20_FLAT');
        //     this.save();
        // }
    }

    save() {
        this.storage.saveInventory({
            items: this.items,
            activeItems: this.activeItems,
        });
    }

    addItem(item) {
        const emptySlot = this.items.findIndex(slot => slot === null);
        if (emptySlot !== -1) {
            this.items[emptySlot] = item;
            this.save();
            return true;
        }
        return false; // Inventory full
    }

    setActiveItems(itemIndices) {
        this.activeItems = itemIndices.map(index => this.items[index] || null);
        this.save();
    }

    swapItems(index1, index2) {
        const temp = this.items[index1];
        this.items[index1] = this.items[index2];
        this.items[index2] = temp;
        this.save();
    }

    swapActiveItems(index1, index2) {
        const temp = this.activeItems[index1];
        this.activeItems[index1] = this.activeItems[index2];
        this.activeItems[index2] = temp;
        this.save();
    }

    equipItem(itemIndex, activeSlotIndex) {
        if (itemIndex < 0 || itemIndex >= this.items.length || !this.items[itemIndex]) return;
        if (activeSlotIndex < 0 || activeSlotIndex >= this.activeItemSlots) return;

        // Swap the item from main inventory with the item in the active slot
        const temp = this.activeItems[activeSlotIndex];
        this.activeItems[activeSlotIndex] = this.items[itemIndex];
        this.items[itemIndex] = temp;

        this.save();
    }

    unequipItem(activeSlotIndex, itemIndex) {
        if (activeSlotIndex < 0 || activeSlotIndex >= this.activeItemSlots || !this.activeItems[activeSlotIndex]) return;
        if (itemIndex < 0 || itemIndex >= this.items.length) return;

        // Swap the active item with the item in the main inventory slot
        const temp = this.items[itemIndex];
        this.items[itemIndex] = this.activeItems[activeSlotIndex];
        this.activeItems[activeSlotIndex] = temp;
        
        this.save();
    }

    deleteItem(type, index) {
        if (type === 'active') {
            if (index >= 0 && index < this.activeItems.length) {
                this.activeItems[index] = null;
            }
        } else if (type === 'main') {
            if (index >= 0 && index < this.items.length) {
                this.items[index] = null;
            }
        }
        this.save();
    }
}
