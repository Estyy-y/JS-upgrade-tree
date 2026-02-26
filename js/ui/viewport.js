import { upgrades } from '../content/upgrades/upgrades.js';
import { player } from '../core/player.js';
import { createUpgradeNode } from '../ui/upgradeNode.js';
import { formatNumber } from './format.js';

export class UpgradeTree {
    constructor(upgrades, container) {
        this.upgrades = upgrades;
        this.container = container;
        this.viewport = container.parentElement;

        this.upgradeNodes = [];
        this.svg = null;

        this.scale = 1;
        this.originX = 0;
        this.originY = 0;
        this.isPanning = false;
        this.cameraEnabled = true;
    }

    init() {
        this.createNodes();
        this.drawConnections();
        this.initPanZoom();
        this.update();
        this.centerOn(this.upgrades[0]);
    }

    createNodes() {
        this.upgradeNodes = this.upgrades.map(upg => {
            const { node, level, cost, desc } = createUpgradeNode(upg);
        
            node.style.left = `${upg.x}px`;
            node.style.top = `${upg.y}px`;
            this.container.appendChild(node);
        
            return { node, level, cost, desc, upgrade: upg };
        });
    }

    drawConnections() {
        this.svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
        this.svg.style.cssText = `
            position:absolute; top:0; left:0;
            width:100%; height:100%; pointer-events:none;
        `;
        this.container.insertBefore(this.svg, this.container.firstChild);

        this.upgrades.forEach(child => {
            if (!child.parent) return;
            const parent = this.upgrades.find(u => u.id === child.parent);
            if (!parent) return;

            const line = document.createElementNS("http://www.w3.org/2000/svg","line");
            line.setAttribute("x1", parent.x + 150);
            line.setAttribute("y1", parent.y + 75);
            line.setAttribute("x2", child.x + 150);
            line.setAttribute("y2", child.y + 75);
            line.setAttribute("stroke", "#555");
            line.setAttribute("stroke-width", "36");

            this.svg.appendChild(line);
        });
    }

    updateCosts() {
        this.upgradeNodes.forEach(({ cost, node, upgrade }) => {
            const level = player.upgrades[upgrade.id] ?? 0;
            const maxed = upgrade.isMaxed(level, player);
            const price = upgrade.getCost(level);
            const affordable = !maxed && upgrade.canAfford(player);

            const costText = maxed ? "Maxed!"
                : price.eq(0) ? "Free!"
                : `${formatNumber(price)}${upgrade.getCostSymbol()}`;

            cost.textContent = costText;
            node.classList.toggle("canBuy", affordable);
        });
    }

    updateLevels() {
        this.upgradeNodes.forEach(({ level, upgrade }) => {
            const currentLevel = player.upgrades[upgrade.id] ?? 0;
            const max = typeof upgrade.getLimit === "function" ? upgrade.getLimit(player) : upgrade.limit;
            level.textContent = `(${currentLevel}/${max})`;
        });
    }

    updateDescriptions() {
        this.upgradeNodes.forEach(({ desc, upgrade }) => {
            const level = player.upgrades[upgrade.id] ?? 0;
            const descText = typeof upgrade.description === "function"
                ? upgrade.description(level, player)
                : upgrade.description || "";

            if (desc.innerHTML !== descText) {
                desc.innerHTML = descText;
            }
        });
    }

    update() {
        this.updateCosts();
        this.updateLevels();
        this.updateDescriptions();
    }
    centerOn(upgrade) {
        if (!upgrade) return;
        const nodeCenterX = upgrade.x + 150;
        const nodeCenterY = upgrade.y + 75;

        const rect = this.viewport.getBoundingClientRect();
        const viewportCenterX = rect.width / 2;
        const viewportCenterY = rect.height / 2;

        this.originX = viewportCenterX - nodeCenterX * this.scale;
        this.originY = viewportCenterY - nodeCenterY * this.scale;

        this.applyTransform();
    }

    applyTransform() {
        this.container.style.transform = `translate(${this.originX}px, ${this.originY}px) scale(${this.scale})`;
    }

    initPanZoom() {
        let lastX = 0, lastY = 0;

        this.viewport.addEventListener("mousedown", e => {
            this.isPanning = true;
            lastX = e.clientX;
            lastY = e.clientY;
        });

        this.viewport.addEventListener("mousemove", e => {
            if (!this.isPanning || !this.cameraEnabled) return;

            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;

            this.originX += dx;
            this.originY += dy;

            lastX = e.clientX;
            lastY = e.clientY;

            this.applyTransform();
        });

        this.viewport.addEventListener("mouseup", () => this.isPanning = false);
        this.viewport.addEventListener("mouseleave", () => this.isPanning = false);

        this.viewport.addEventListener("wheel", e => {
            if (!this.cameraEnabled) return;
            e.preventDefault();

            const rect = this.viewport.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const zoomFactor = 1.1;
            let newScale = e.deltaY < 0 ? this.scale * zoomFactor : this.scale / zoomFactor;
            newScale = Math.min(2, Math.max(0.25, newScale));

            const worldX = (mouseX - this.originX) / this.scale;
            const worldY = (mouseY - this.originY) / this.scale;

            this.originX = mouseX - worldX * newScale;
            this.originY = mouseY - worldY * newScale;

            this.scale = newScale;
            this.applyTransform();
        });
    }

    setCameraEnabled(state) {
        this.cameraEnabled = state;
        this.isPanning = false;
    }
}

const container = document.getElementById("tree-container");
export const upgradeTree = new UpgradeTree(upgrades, container);
upgradeTree.init();