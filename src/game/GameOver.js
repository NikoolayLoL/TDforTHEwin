export default class GameOver {
    constructor() {
        this.element = document.getElementById('game-over-overlay');
    }

    show() {
        if (this.element) {
            this.element.style.display = 'flex';
        }
    }

    hide() {
        if (this.element) {
            this.element.style.display = 'none';
        }
    }
}
