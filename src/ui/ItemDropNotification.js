// src/ui/ItemDropNotification.js
import { rarityColors, effects } from '../effects/effectDefinitions.js';

export default class ItemDropNotification {
    constructor(item, x, y) {
        this.item = item;
        this.x = x;
        this.y = y;
        this.lifetime = 6; // 6 seconds
        this.age = 0;
        this.dismissed = false;
        this.isHovered = false;
        
        // Animation properties
        this.initialY = y;
        this.targetY = y - 50;
        this.scale = 0.5;
        this.targetScale = 1;
        this.opacity = 1;
        
        // Create DOM element
        this.createElement();
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'item-drop-notification';
        this.element.style.position = 'absolute';
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        this.element.style.transform = `scale(${this.scale})`;
        this.element.style.opacity = this.opacity;
        this.element.style.pointerEvents = 'all';
        this.element.style.zIndex = '1000';
        this.element.style.cursor = 'pointer';

        // Get rarity and effect info
        const effect = this.item.effectId ? 
            effects[this.item.effectId] : 
            { rarity: 'common' };
        
        const rarity = effect?.rarity || 'common';
        const rarityColor = rarityColors[rarity] || '#ffffff';

        this.element.innerHTML = `
            <div class="item-icon" style="
                width: 40px;
                height: 40px;
                border-radius: 8px;
                background: ${rarityColor};
                box-shadow: 0 0 20px ${rarityColor}aa;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                color: #000;
                border: 2px solid ${rarityColor};
                animation: itemGlow 2s infinite alternate;
            ">
                ${this.item.name.substring(0, 3)}
            </div>
            <div class="item-tooltip" style="
                position: absolute;
                bottom: 50px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.9);
                color: ${rarityColor};
                padding: 8px 12px;
                border-radius: 6px;
                white-space: nowrap;
                font-size: 14px;
                border: 1px solid ${rarityColor};
                display: none;
                z-index: 1001;
            ">
                <div style="font-weight: bold; color: ${rarityColor};">${this.item.name}</div>
                <div style="color: #ccc; font-size: 12px;">${this.item.description}</div>
                <div style="color: #999; font-size: 11px; margin-top: 4px;">Click to dismiss</div>
            </div>
        `;

        // Event listeners
        this.element.addEventListener('mouseenter', () => {
            this.isHovered = true;
            this.element.querySelector('.item-tooltip').style.display = 'block';
        });

        this.element.addEventListener('mouseleave', () => {
            this.isHovered = false;
            this.element.querySelector('.item-tooltip').style.display = 'none';
        });

        this.element.addEventListener('click', () => {
            this.dismiss();
        });

        // Add to game canvas container
        const canvas = document.getElementById('gameCanvas');
        const canvasRect = canvas.getBoundingClientRect();
        this.element.style.left = `${canvasRect.left + this.x}px`;
        this.element.style.top = `${canvasRect.top + this.y}px`;
        
        document.body.appendChild(this.element);
    }

    update(dt) {
        if (this.dismissed) return false;

        this.age += dt;
        
        // Animation easing
        const progress = Math.min(this.age / 0.5, 1); // 0.5 second animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        // Animate position and scale
        this.y = this.initialY + (this.targetY - this.initialY) * easeOut;
        this.scale = 0.5 + (this.targetScale - 0.5) * easeOut;
        
        // Fade out in last second
        if (this.age > this.lifetime - 1) {
            this.opacity = this.lifetime - this.age;
        }
        
        // Update DOM element
        if (this.element) {
            const canvas = document.getElementById('gameCanvas');
            const canvasRect = canvas.getBoundingClientRect();
            this.element.style.left = `${canvasRect.left + this.x}px`;
            this.element.style.top = `${canvasRect.top + this.y}px`;
            this.element.style.transform = `scale(${this.scale})`;
            this.element.style.opacity = this.opacity;
        }
        
        // Remove after lifetime
        if (this.age >= this.lifetime) {
            this.dismiss();
            return false;
        }
        
        return true;
    }

    dismiss() {
        this.dismissed = true;
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}