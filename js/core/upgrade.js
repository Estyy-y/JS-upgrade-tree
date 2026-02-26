import { CURRENCY, GRID_ADD } from '../constants.js';
import { player } from './player.js';

export class Upgrade {
    constructor(id, name, position = [0, 0], options = {}) {
        this.id = id;
        this.name = name;

        this.x = (position[0] + GRID_ADD) * 400;
        this.y = (position[1] + GRID_ADD) * 275;

        this.parent = options.parent ?? null;
        this.description = options.description ?? null;
        this.cost = options.cost ?? null;

        // Limit is static or a function
        this.getLimit = typeof options.limit === "function"
            ? () => options.limit(player)
            : () => options.limit ?? Infinity;

        if (options.effect) {
            this.effect = { ...options.effect };
            if (typeof this.effect.amountFunction === 'function') {
                const originalFn = this.effect.amountFunction;
                this.effect.amountFunction = () => originalFn(this.getLevel(), player);
            }
        }
    }

    getLevel() {
        return player.upgrades[this.id] ?? 0;
    }

    isMaxed() {
        return this.getLevel() >= this.getLimit();
    }

    getCost() {
        return this.cost.formula(this.getLevel(), player);
    }

    // (nuke this later)
    getCostSymbol() {
        const entry = Object.values(CURRENCY).find(c => c.id === this.cost.currency);
        return entry ? entry.symbol : "?";
    }

    canAfford() {
        const price = this.getCost();
        return player.currency[this.cost.currency].amount.gte(price);
    }

    purchase() {
        if (this.isMaxed() || !this.canAfford()) return false;

        const price = this.getCost();
        player.currency[this.cost.currency].amount = player.currency[this.cost.currency].amount.sub(price);

        const newLevel = this.getLevel() + 1;
        player.upgrades[this.id] = newLevel;

        return true;
    }

    getDescription() {
        if (!this._descriptionFn) return '';
        return this._descriptionFn(this.getLevel(), player);
    }
}