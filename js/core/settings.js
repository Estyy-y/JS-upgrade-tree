import { player } from './player.js';

export function getScientificThreshold() {
    return player.settings.scientificThreshold ?? 3;
}

export function setScientificThreshold(value) {
    const num = Math.min(303, Math.max(3, Number(value)));
    player.settings.scientificThreshold = num;
}