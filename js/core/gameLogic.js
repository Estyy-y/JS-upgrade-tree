import { upgrades } from '../content/upgrades/upgrades.js';
import { CURRENCY } from '../constants.js';
import { player } from '../core/player.js';

export function calculatePassiveIncome() {
    const baseIncome = {};
    const multipliers = {};

    for (const c of Object.values(CURRENCY)) {
        baseIncome[c.id] = new Decimal(0);
        multipliers[c.id] = new Decimal(1);
    }

    upgrades.forEach(upg => {
        const level = player.upgrades[upg.id] ?? 0;

        if (level <= 0 || !upg.effect) return;

        const { type, currency, amount, amountFunction } = upg.effect;

        const effectValue = amountFunction
            ? amountFunction(level, player)
            : amount;

        switch (type) {
            case "currencyPerSecond":
                baseIncome[currency] = baseIncome[currency].add(new Decimal(effectValue));
                break;

            case "currencyMultiplier":
                multipliers[currency] = multipliers[currency].mul(new Decimal(effectValue));
                break;
        }
    });

    const income = {};
    for (const c of Object.values(CURRENCY)) {
        const id = c.id;
        income[id] = baseIncome[id].mul(multipliers[id]);
    }

    return income;
}