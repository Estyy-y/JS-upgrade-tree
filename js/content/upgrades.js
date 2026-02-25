import { CURRENCY } from '../constants.js';
import { Upgrade } from '../core/upgrade.js';
import { player } from '../core/player.js';

export const upgrades = [
    new Upgrade("1p", "Beginning", [0, 0], {
        description: "Begin generating 'Power': <span class='currency-symbol'>₽</span><br>at a rate of 1/s",
        limit: 1,
        baseCost: 0,
        effect: {
            type: "currencyPerSecond",
            amount: 1,
            currency: CURRENCY.POWER.id
        },
        parent: null,
    }),
    new Upgrade("2p", "Multiplier", [1, 0], {
        description: "×2 ₽ gain",
        limit: 1,
        cost: { amount: new Decimal(10), currency: CURRENCY.POWER.id },
        effect: {
            type: "currencyMultiplier",
            amount: 2,
            currency: CURRENCY.POWER.id
        },
        parent: "1p",
    }),
        new Upgrade("3p", "Another Multiplier", [1, 1], {
        description: "×3 ₽ gain",
        limit: 1,
        cost: { amount: new Decimal(25), currency: CURRENCY.POWER.id },
        effect: {
            type: "currencyMultiplier",
            amount: 3,
            currency: CURRENCY.POWER.id
        },
        parent: "2p",
    }),
        new Upgrade("4p", "Compounding", [1, -1], {
        description: (upgrade) => {
            const amountPerLevel = 1.5;
            const symbol = CURRENCY.POWER.symbol;
            const current =  Math.round(amountPerLevel ** upgrade.level * 100) / 100;
            return `×${amountPerLevel}${symbol} gain compounding<br>Currently: ×${current}${symbol}`;
        },
        limit: 5,
        cost: { amount: new Decimal(50), increaseType: "multiplicative", increase: "2", currency: CURRENCY.POWER.id },
        effect: {
            type: "currencyMultiplierComp",
            amount: 1.5,
            currency: CURRENCY.POWER.id
        },
        parent: "2p",
    }),
    new Upgrade("5p", "Extra Base", [-1, 0], {
        description: (upgrade) => {
            const amountPerLevel = 2;
            const symbol = CURRENCY.POWER.symbol;
            const current = upgrade.level * amountPerLevel;
            return `+${amountPerLevel}${symbol}/s per level<br>Currently: +${current}${symbol}/s`;
        },
        limit: 2,
        cost: { amount: new Decimal(250), increaseType: "additive", increase: new Decimal(750), currency: CURRENCY.POWER.id },
        effect: {
            type: "currencyPerSecond",
            amount: 2,
            currency: CURRENCY.POWER.id
        },
        parent: "1p",
    }),
    new Upgrade("6p", "Scaling Base", [-1, -1], {
        description: (upgrade) => {
            const symbol = CURRENCY.POWER.symbol;
            let current = player.currency.power.amount.log10().mul(upgrade.level);
            current = EternalNotations.Presets.Default.format(current);
            return `Gain more ${symbol}/s based on<br>how ${symbol} you have<br>
                    Currently: +${current}${symbol}/s<br>
                    <span class="upgrade-node-description-small">+log10(₽)</span>`
        },
        limit: 1,
        cost: { amount: new Decimal(3000), currency: CURRENCY.POWER.id },
        effect: {
            type: "currencyPerSecond",
            amountFunction: (upgrade) => player.currency.power.amount.log10(),
            currency: CURRENCY.POWER.id
        },
        parent: "5p",
    }),
    new Upgrade("7p", "Lots of Multipliers", [2, 1], {
        description: (upgrade) => {
            const symbol = CURRENCY.POWER.symbol;
            let current = 1 + upgrade.level * 0.5;
            current = EternalNotations.Presets.Default.format(current);
            return `Plus ×0.5${symbol} gain per level<br>
                    Currently: ×${current}${symbol}<br>`
        },
        limit: 20,
        cost: { amount: new Decimal(2000), increaseType: "multiplicative", increase: 1.2, currency: CURRENCY.POWER.id },
        effect: {
            type: "currencyMultiplier",
            amountFunction: (upgrade) => 1 + upgrade.level * 0.5,
            currency: CURRENCY.POWER.id
        },
        parent: "3p",
    }),
];