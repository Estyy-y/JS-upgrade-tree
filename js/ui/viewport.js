import { player } from '../core/player.js';
import { upgrades } from '../content/upgrades.js';
import { createUpgradeNode } from '../ui/upgradeNode.js';

const container = document.getElementById("tree-container");
const viewport = container.parentElement;

let scale = 1;
let originX = 0;
let originY = 0;
let isPanning = false;

let upgradeNodes = [];
let svg;

/**
 * Create all upgrade nodes and append to container
 */
function initUpgradeNodes() {
    upgradeNodes = upgrades.map(upg => {
        const { node, cost, level } = createUpgradeNode(upg);

        node.style.position = "absolute";
        node.style.left = `${upg.x}px`;
        node.style.top = `${upg.y}px`;

        container.appendChild(node);

        return { node, cost, level, upgrade: upg };
    });
}

/**
 * Draw lines between parent and child upgrades
 */
function drawConnections() {
    svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.style.pointerEvents = "none";

    container.insertBefore(svg, container.firstChild);

    upgrades.forEach(child => {
        if (!child.parent) return;

        const parent = upgrades.find(u => u.id === child.parent);
        if (!parent) return;

        const line = document.createElementNS("http://www.w3.org/2000/svg","line");
        line.setAttribute("x1", parent.x + 125);
        line.setAttribute("y1", parent.y + 62.5);
        line.setAttribute("x2", child.x + 125);
        line.setAttribute("y2", child.y + 62.5);
        line.setAttribute("stroke", "#555555");
        line.setAttribute("stroke-width", "36");

        svg.appendChild(line);
    });
}

/**
 * Update all upgrade cost texts
 */

export function updateUpgradeCosts() {
    upgradeNodes.forEach(({ node, cost, upgrade }) => {
        let costText;

        const maxed = upgrade.isMaxed();
        const affordable = !maxed && upgrade.canAfford(player);

        if (maxed) {
            costText = "Maxed!";
        } else if (upgrade.cost && upgrade.cost.amount.eq(0)) {
            costText = "Free!";
        } else if (upgrade.cost) {
            costText = `${upgrade.cost.amount.round().toString()}${upgrade.getCostSymbol()}`;
        } else {
            costText = "Free!";
        }

        if (cost.textContent !== costText) {
            cost.textContent = costText;
        }

        node.classList.toggle("canBuy", affordable);
    });
}

/**
 * Update all upgrade level texts
 */
export function updateUpgradeLevel() {
    upgradeNodes.forEach(({ level, upgrade }) => {
        level.textContent = `(${upgrade.level}/${upgrade.limit})`;
    });
}

/**
 * Update all upgrade description texts
 */

// todo: uniformity with the other methods
export function updateUpgradeDescriptions() {
    upgradeNodes.forEach(({ upgrade, node }) => {
        if (!upgrade || !node) return;

        let descText;

        if (typeof upgrade.description === "function") {
            descText = upgrade.description(upgrade);
        } else {
            descText = upgrade.description || "";
        }


        const descEl = node.querySelector(".upgrade-node-description");
        if (descEl && descEl.innerHTML !== descText) {
            descEl.innerHTML = descText;
        }
    });
}

/**
 * Center the camera on a given upgrade
 */
function centerCameraOn(upgrade) {
    if (!upgrade) return;

    const nodeCenterX = upgrade.x + 125;
    const nodeCenterY = upgrade.y + 62.5;

    const viewportRect = viewport.getBoundingClientRect();
    const viewportCenterX = viewportRect.width / 2;
    const viewportCenterY = viewportRect.height / 2;

    originX = viewportCenterX - nodeCenterX * scale;
    originY = viewportCenterY - nodeCenterY * scale;

    applyTransform();
}

/**
 * Apply the current origin & scale to the container
 */
function applyTransform() {
    container.style.transform = `translate(${originX}px, ${originY}px) scale(${scale})`;
}

/**
 * Initialize pan & zoom interactions
 */
function initPanZoom() {
    let lastMouseX = 0;
    let lastMouseY = 0;

    viewport.addEventListener("mousedown", (e) => {
        isPanning = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    });

    viewport.addEventListener("mousemove", (e) => {
        if (!isPanning) return;

        // Move container by mouse delta divided by current scale
        const dx = (e.clientX - lastMouseX);
        const dy = (e.clientY - lastMouseY);

        originX += dx;
        originY += dy;

        lastMouseX = e.clientX;
        lastMouseY = e.clientY;

        applyTransform();
    });

    viewport.addEventListener("mouseup", () => { isPanning = false; });
    viewport.addEventListener("mouseleave", () => { isPanning = false; });

    viewport.addEventListener("wheel", (e) => {
        e.preventDefault();

        const rect = viewport.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const zoomFactor = 1.1;
        let newScale = e.deltaY < 0 ? scale * zoomFactor : scale / zoomFactor;
        const MIN_SCALE = 0.25;
        const MAX_SCALE = 2;
        newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, newScale));

        // Compute world position under mouse before zoom
        const worldX = (mouseX - originX) / scale;
        const worldY = (mouseY - originY) / scale;

        // Update origin so the world point under the mouse stays fixed
        originX = mouseX - worldX * newScale;
        originY = mouseY - worldY * newScale;

        scale = newScale;
        applyTransform();
    });
}

/**
 * Initialize the entire tree UI
 */
export function initUpgradeTree() {
    initUpgradeNodes();
    drawConnections();
    updateUpgradeCosts();
    updateUpgradeLevel();
    initPanZoom();
    centerCameraOn(upgrades[0]);
}

initUpgradeTree();