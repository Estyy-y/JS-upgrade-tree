import { player } from './core/player.js';
import { saveGame, loadGame, restore } from "./core/save.js";
import { calculatePassiveIncome } from './core/gameLogic.js';
import { createCurrencyDisplay } from './ui/currencyDisplay.js';
import { updateUpgradeCosts, updateUpgradeDescriptions, updateUpgradeLevel } from './ui/viewport.js';

import './ui/viewport.js';
import './ui/menu.js';
import './ui/keybinds.js';

const currencyUI = createCurrencyDisplay(player);
const MIN_TICK = 33;

const loaded = loadGame();
if (loaded) {
    restore(player, loaded);
} else {
    player.lastUpdate = Date.now();
}
// Autosave every 5 seconds
setInterval(() => saveGame(player), 5000);
// Save on tab close
//window.addEventListener("beforeunload", () => saveGame(player));

function gameLoop() {
    
    const now = Date.now();
    const diff = (now - player.lastUpdate) / 1000;
    player.lastUpdate = now;

    const income = calculatePassiveIncome();
    
    for (const currencyId in income) {
        const currency = player.currency[currencyId];
        if (!currency) continue;

        currency.perSecond = income[currencyId]
        currency.amount = currency.amount.add(
            income[currencyId].mul(diff)
        );
    }

    currencyUI.update();
    updateUpgradeCosts();
    updateUpgradeLevel();
    updateUpgradeDescriptions();

    setTimeout(gameLoop, MIN_TICK);


}

gameLoop();