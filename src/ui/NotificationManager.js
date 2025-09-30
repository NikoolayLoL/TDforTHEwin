// src/ui/NotificationManager.js
import ItemDropNotification from './ItemDropNotification.js';

export default class NotificationManager {
    constructor() {
        this.notifications = [];
    }

    showItemDrop(item, x, y) {
        const notification = new ItemDropNotification(item, x, y);
        this.notifications.push(notification);
    }

    update(dt) {
        // Update all notifications and remove dismissed ones
        this.notifications = this.notifications.filter(notification => {
            return notification.update(dt);
        });
    }

    cleanup() {
        // Dismiss all notifications
        this.notifications.forEach(notification => notification.dismiss());
        this.notifications = [];
    }
}