import { player } from "../core/player.js";
import { SUFFIXES } from "../constants.js";

export function formatNumber(value) {
    if (value == null) return "0.00";

    const num = value instanceof Decimal ? value : new Decimal(value);
    if (!num.isFinite()) return "Infinity";
    if (num.eq(0)) return "0.00";

    const exponent = num.e;

    if (exponent < player.settings.scientificThreshold) {
        return formatSuffix(num);
    }

    return formatScientific(num);
}

function formatSuffix(num) {
    const exponent = num.e;

    if (exponent < 3) return num.toFixed(2);

    const tier = Math.floor(exponent / 3);
    const scaled = num.div(Decimal.pow(10, tier * 3));
    const formatted = scaled.toPrecision(3);

    const suffix = tier < SUFFIXES.length ? SUFFIXES[tier] : `e${exponent}`;
    return formatted + suffix;
}

function formatScientific(num) {
    const exponent = num.log10().floor();
    const mantissa = num.div(Decimal.pow(10, exponent));
    return `${mantissa.toFixed(2)}e${exponent}`;
}