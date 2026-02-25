import { CURRENCY, GRID_ADD } from "../constants.js";

export class Upgrade {
    constructor(id, name, position = [0,0], options = {}) {

        this.id = id;
        this.name = name;
        this.x = (position[0] + GRID_ADD) * 400;
        this.y = (position[1] + GRID_ADD) * 275;
        this.level = 0;

        this.description = options.description || null;
        this.limit = options.limit || null;
        this.cost = options.cost || { amount: new Decimal(0), increaseType: null, increase: null, currency: CURRENCY.POWER.id };
        this.effect = options.effect || null;
        this.parent = options.parent || null;
        
    }

    updateCost() {
    if (!this.cost.increaseType || !this.cost.increase) return;

    switch (this.cost.increaseType) {
        case "additive":
            this.cost.amount = this.cost.amount.add(new Decimal(this.cost.increase));
            break;
        case "multiplicative":
            this.cost.amount = this.cost.amount.mul(new Decimal(this.cost.increase));
            break;
        case "exponential":
            const base = this.cost.baseAmount || this.cost.amount; 
            this.cost.amount = base.mul(new Decimal(this.cost.increase).pow(this.level));
            break;
        default:
            console.warn(`Unknown increaseType: ${this.cost.increaseType}`);
    }
}

    getCostSymbol() {
        const entry = Object.values(CURRENCY).find(c => c.id === this.cost.currency);
        return entry ? entry.symbol : "?";
    }

    isMaxed() {
        return this.level >= this.limit;
    }

    canAfford(player) {
        return player.currency[this.cost.currency].amount.gte(this.cost.amount);
    }

    purchase(player) {
        if (!this.canAfford(player) || this.isMaxed()) return false;

        const currency = player.currency[this.cost.currency];
        currency.amount = currency.amount.sub(this.cost.amount);

        this.updateCost();
        player.upgrades[this.id] = ++this.level;

        return true;
    }
    
    
}