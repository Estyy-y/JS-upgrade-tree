import { upgrades } from '../content/upgrades.js';
import { CURRENCY } from '../constants.js';

export function calculatePassiveIncome() {
    const baseIncome = {};
    const multipliers = {};

    for (const c of Object.values(CURRENCY)) {
        baseIncome[c.id] = new Decimal(0);
        multipliers[c.id] = new Decimal(1);
    }


    upgrades.forEach(upg => {
        if (upg.level <= 0 || !upg.effect) return;

        const { type, currency, amount, amountFunction } = upg.effect;

        switch (type) {
            case "currencyPerSecond":
    
                let effectAmount = amount;
                if (amountFunction) {
                    effectAmount = amountFunction(upg);
                }
                baseIncome[currency] = baseIncome[currency].add(new Decimal(effectAmount).mul(upg.level));
                break;
        }
    });


    upgrades.forEach(upg => {
        if (upg.level <= 0 || !upg.effect) return;

        const { type, amount, amountFunction, currency } = upg.effect;

        const actualAmount = amountFunction ? amountFunction(upg) : amount;

        switch (type) {
            case "currencyMultiplier":
                multipliers[currency] = multipliers[currency].mul(new Decimal(actualAmount));
                break;
            case "currencyMultiplierComp":
                multipliers[currency] = multipliers[currency].mul(new Decimal(actualAmount).pow(upg.level));
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