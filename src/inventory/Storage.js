// src/inventory/Storage.js

// This is an adapter that can be swapped with a backend implementation later.
class LocalStorageAdapter {
    save(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    load(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }
}

class BackendStorageAdapter {
    // Example of what a backend adapter might look like
    async save(key, data) {
        // await fetch(`/api/user/inventory`, { method: 'POST', body: JSON.stringify({ [key]: data }) });
        console.log('Pretending to save to backend:', key, data);
    }

    async load(key) {
        // const response = await fetch(`/api/user/inventory?key=${key}`);
        // const data = await response.json();
        // return data;
        console.log('Pretending to load from backend:', key);
        return null;
    }
}


export default class Storage {
    constructor() {
        // We can easily switch to BackendStorageAdapter later
        this.adapter = new LocalStorageAdapter();
    }

    saveInventory(inventory) {
        this.adapter.save('inventory', inventory);
    }

    loadInventory() {
        return this.adapter.load('inventory');
    }
}
