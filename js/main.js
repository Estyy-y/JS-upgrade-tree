import { player } from './core/player.js';
import { saveGame, loadGame, restore } from './core/save.js';
import { calculatePassiveIncome } from './core/gameLogic.js';
import { createCurrencyDisplay } from './ui/currencyDisplay.js';
import { upgradeTree } from './ui/viewport.js';

import './ui/menu.js'

const currencyUI = createCurrencyDisplay(player);
const TICK_MS = 33;

const savedData = loadGame();
if (savedData) {
    restore(player, savedData);
} else {
    player.lastUpdate = Date.now();
}

setInterval(() => saveGame(player), 5000);
// window.addEventListener("beforeunload", () => saveGame(player));

function gameLoop() {
    const now = Date.now();
    const dt = (now - player.lastUpdate) / 1000;
    player.lastUpdate = now;

    const income = calculatePassiveIncome();
    for (const id in income) {
        const cur = player.currency[id];
        if (!cur) continue;
        cur.perSecond = income[id];
        cur.amount = cur.amount.add(income[id].mul(dt));
    }

    currencyUI.update();

    upgradeTree.update();

    setTimeout(gameLoop, TICK_MS);
}

gameLoop();