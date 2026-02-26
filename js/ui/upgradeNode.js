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

    middle.appendChild(desc);

    // ----- BOTTOM -----
    const bottom = document.createElement("div");
    bottom.classList.add("upgrade-node-bottom");

    const levelEl = document.createElement("div");
    levelEl.classList.add("upgrade-node-effect");

    const costEl = document.createElement("div");
    costEl.classList.add("upgrade-node-cost");

    bottom.appendChild(levelEl);
    bottom.appendChild(costEl);

    // Assemble node
    node.appendChild(top);
    node.appendChild(middle);
    node.appendChild(bottom);

    // click handler
    node.addEventListener("click", () => {
        upgrade.purchase(player);
    });

    // Return direct references to all dynamic elements
    return { node, level: levelEl, cost: costEl, desc };
}