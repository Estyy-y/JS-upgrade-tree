import { player } from "../core/player.js";
import { saveGame } from "../core/save.js";

window.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "s") {
        saveGame(player);
        console.log("Game saved!");
    }
});