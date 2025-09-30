// src/inventory/Item.js
export default class Item {
    constructor(name, description, effectId = null) {
        // Use a more compatible way to generate a unique ID
        this.id = Date.now().toString(36) + Math.random().toString(36).substring(2);
        this.name = name;
        this.description = description;
        this.effectId = effectId;
    }
}
