export default class UI {
    constructor(game) {
        this.game = game;
        this.livesElement = document.getElementById('lives');
        this.goldElement = document.getElementById('gold');
        this.waveElement = document.getElementById('wave-number');
        this.rangeCostElement = document.getElementById('upgrade-range-cost');
        this.speedCostElement = document.getElementById('upgrade-speed-cost');
        this.damageCostElement = document.getElementById('upgrade-damage-cost');
    }

    draw() {
        this.livesElement.textContent = this.game.lives;
        this.goldElement.textContent = this.game.gold;
        this.waveElement.textContent = this.game.waveManager.waveNumber;
        this.rangeCostElement.textContent = this.game.tower.rangeCost;
        this.speedCostElement.textContent = this.game.tower.speedCost;
        this.damageCostElement.textContent = this.game.tower.damageCost;
    }
}
