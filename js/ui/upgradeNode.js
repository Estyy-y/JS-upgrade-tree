import { player } from '../core/player.js';

export function createUpgradeNode(upgrade) {
    const node = document.createElement("div");
    node.classList.add("upgrade-node");
    node.style.position = "absolute";

    // ----- TOP -----
    const top = document.createElement("div");
    top.classList.add("upgrade-node-top");

    const idEl = document.createElement("div");
    idEl.classList.add("upgrade-node-id");
    idEl.textContent = '#' + upgrade.id;

    const nameEl = document.createElement("div");
    nameEl.classList.add("upgrade-node-name");
    nameEl.textContent = upgrade.name;

    top.appendChild(idEl);
    top.appendChild(nameEl);

    // ----- MIDDLE (description) -----
    const middle = document.createElement("div");
    middle.classList.add("upgrade-node-middle");

    const desc = document.createElement("div");
    desc.classList.add("upgrade-node-description");

    // Render description (dynamic or static)
    if (typeof upgrade.description === "function") {
        desc.innerHTML = upgrade.description(upgrade);
    } else {
        desc.innerHTML = upgrade.description || "";
    }

    middle.appendChild(desc);

    // ----- BOTTOM -----
    const bottom = document.createElement("div");
    bottom.classList.add("upgrade-node-bottom");

    const level = document.createElement("div");
    level.classList.add("upgrade-node-effect");

    const cost = document.createElement("div");
    cost.classList.add("upgrade-node-cost");

    bottom.appendChild(level);
    bottom.appendChild(cost);

    // Assemble node
    node.appendChild(top);
    node.appendChild(middle);
    node.appendChild(bottom);

    // click handler
    node.addEventListener("click", () => {
        upgrade.purchase(player);
    });

    return { node, level, cost };
}