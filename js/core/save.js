import { upgrades } from '../content/upgrades.js';

export const SAVE_KEY = "myGameSave";

export function saveGame(player) {
    if (!player) return;

    const saveData = {
        version: 1,
        data: {
            currency: {},
            upgrades: player.upgrades || {},
            lastUpdate: player.lastUpdate || Date.now()
        }
    };

    // Save currencies as strings
    for (const key in player.currency) {
        saveData.data.currency[key] = {
            amount: player.currency[key].amount.toString(),
            perSecond: player.currency[key].perSecond || 0
        };
    }

    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
}

export function loadGame() {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw);
        if (!parsed.version) return null;

        return parsed.data;
    } catch (e) {
        console.warn("Failed to parse save:", e);
        return null;
    }
}

/**
 * Restore loaded save into the player object
 * Converts Decimals and updates Upgrade objects
 */
export function restore(player, loaded) {
    if (!player || !loaded) return;


    if (loaded.currency) {
        for (const key in loaded.currency) {
            if (!player.currency[key]) continue;

            player.currency[key].amount = new Decimal(loaded.currency[key].amount);
            player.currency[key].perSecond = loaded.currency[key].perSecond || 0;
        }
    }

    player.upgrades = loaded.upgrades || {};

    upgrades.forEach(upg => {
        if (player.upgrades[upg.id] != null) {
            upg.level = player.upgrades[upg.id];
            upg.updateCost();        
        }
    });

    player.lastUpdate = loaded.lastUpdate || Date.now();
}

export function resetSave() {
    localStorage.removeItem(SAVE_KEY);
}