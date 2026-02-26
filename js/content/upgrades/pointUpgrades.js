import { CURRENCY } from '../../constants.js';
import { Upgrade } from '../../core/upgrade.js';
import { formatNumber } from '../../ui/format.js';

// Highlight helper
export function h(text) {
    return `<span class="highlight">${text}</span>`;
}

export const pointUpgrades = [
    new Upgrade("1p", "Beginning", [0, 0], {
        description: `Begin generating ${h("'" + CURRENCY.POWER.name + "' " + CURRENCY.POWER.symbol)}<br>at a rate of ${h('1/s')}`,
        limit: 1,
        cost: {
            currency: CURRENCY.POWER.id,
            formula: () => new Decimal(0)
        },
        effect: {
            type: "currencyPerSecond",
            amount: new Decimal(1),
            currency: CURRENCY.POWER.id
        },
    }),

    new Upgrade("2p", "Multiplier", [1, 0], {
        description: `${h('×2' + CURRENCY.POWER.symbol)} gain`,
        limit: 1,
        cost: {
            currency: CURRENCY.POWER.id,
            formula: () => new Decimal(20)
        },
        effect: {
            type: "currencyMultiplier",
            amount: new Decimal(2),
            currency: CURRENCY.POWER.id
        },
        parent: "1p",
    }),

    new Upgrade("3p", "Another Multiplier", [1, 1], {
        description: `${h('×3' + CURRENCY.POWER.symbol)} gain`,
        limit: 1,
        cost: {
            currency: CURRENCY.POWER.id,
            formula: () => new Decimal(100)
        },
        effect: {
            type: "currencyMultiplier",
            amount: new Decimal(3),
            currency: CURRENCY.POWER.id
        },
        parent: "2p",
    }),

    new Upgrade("4p", "Compounding", [1, -1], {
        limit: 5,
        cost: {
            currency: CURRENCY.POWER.id,
            formula: level => new Decimal(300).mul(Decimal.pow(2, level))
        },
        description: level => {
            const current = formatNumber(Decimal.pow(1.5, level));
            return `${h('×1.5' + CURRENCY.POWER.symbol)} gain compounding per level<br>Currently: ${h('×' + current + CURRENCY.POWER.symbol)}`;
        },
        effect: {
            type: "currencyMultiplier",
            amountFunction: level => Decimal.pow(1.5, level),
            currency: CURRENCY.POWER.id
        },
        parent: "2p",
    }),

    new Upgrade("5p", "Extra Base", [-1, 0], {
        limit: 3,
        cost: {
            currency: CURRENCY.POWER.id,
            formula: level => new Decimal(50).mul(Decimal.pow(5, level))
        },
        description: level => {
            const current = formatNumber(level * 2);
            return `+${h('2' + CURRENCY.POWER.symbol + '/s')} per level<br>Currently: ${h('+' + current + CURRENCY.POWER.symbol + '/s')}`;
        },
        effect: {
            type: "currencyPerSecond",
            amountFunction: level => level * 2,
            currency: CURRENCY.POWER.id
        },
        parent: "1p",
    }),

    new Upgrade("6p", "Scaling Base", [-1, -1], {
        limit: 1,
        cost: {
            currency: CURRENCY.POWER.id,
            formula: () => new Decimal(40000)
        },

        description: (level, player) => {

            let amount = player.currency.power.amount
            let bonus = amount.eq(0) ? 0 : amount.log10().mul(level)
            
            const exponentText = (player.upgrades["9p"] ?? 0) > 0 ? '^1.2' : '';
            if ((player.upgrades["9p"] ?? 0) > 0) bonus = bonus.pow(1.2);

            const current = formatNumber(bonus);
            return `Gain more ${h(CURRENCY.POWER.symbol + '/s')} based on how<br>much ${h(CURRENCY.POWER.symbol)} you have<br>Currently: ${h('+' + current + CURRENCY.POWER.symbol + '/s')}<br><span class="upgrade-node-description-small">+log10(${CURRENCY.POWER.symbol})${exponentText}</span>`;
        },
        effect: {
            type: "currencyPerSecond",
            amountFunction: (level, player) => {
                if (level === 0) return new Decimal(0);
                let bonus = player.currency.power.amount.log10().mul(level);
                if ((player.upgrades["9p"] ?? 0) > 0) bonus = bonus.pow(1.2);
                return bonus.div(level);
            },
            currency: CURRENCY.POWER.id
        },
        parent: "5p",
    }),

    new Upgrade("7p", "Lots of Multipliers", [2, 1], {
        limit: 20,
        cost: {
            currency: CURRENCY.POWER.id,
            formula: level => new Decimal(2000).mul(Decimal.pow(1.2, level))
        },
        description: level => {
            const current = formatNumber(1 + level * 0.5);
            return `Plus ${h('×0.5' + CURRENCY.POWER.symbol)} per level<br>Currently: ${h('×' + current + CURRENCY.POWER.symbol)}`;
        },
        effect: {
            type: "currencyMultiplier",
            amountFunction: level => 1 + level * 0.5,
            currency: CURRENCY.POWER.id
        },
        parent: "3p",
    }),

    new Upgrade("8p", "Base After Base", [-1, 1], {
        limit: player => (player.upgrades["10p"] ?? 0) > 0 ? 30 : 10,
        cost: {
            currency: CURRENCY.POWER.id,
            formula: level => {
                let cost = new Decimal(10000).mul(Decimal.pow(1.1, level));
                if (level > 10) cost = cost.mul(Decimal.pow(1.2, level - 10));
                return cost;
            }
        },
        description: level => {
            const current = formatNumber(new Decimal(level).mul(0.4));
            return `+${h('0.4' + CURRENCY.POWER.symbol + '/s')} per level<br>Currently: ${h('+' + current + CURRENCY.POWER.symbol + '/s')}`;
        },
        effect: {
            type: "currencyPerSecond",
            amountFunction: level => new Decimal(level).mul(0.4),
            currency: CURRENCY.POWER.id
        },
        parent: "5p",
    }),

    new Upgrade("9p", "Yet another Multiplier", [1, 2], {
        limit: 1,
        cost: {
            currency: CURRENCY.POWER.id,
            formula: () => new Decimal(100000)
        },
        description: level => `${h('×5' + CURRENCY.POWER.symbol)} gain`,
        effect: {
            type: "currencyMultiplier",
            amountFunction: level => level * 5,
            currency: CURRENCY.POWER.id
        },
        parent: "3p",
    }),
];