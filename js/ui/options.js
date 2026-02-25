import { resetSave } from '../core/save.js';

export function createOptionsContent(container) {
    const title = document.createElement("h2");
    title.textContent = "Options";
    container.appendChild(title);

    const resetBtn = document.createElement("button");
    resetBtn.textContent = "Reset Save";
    resetBtn.style.padding = "10px 16px";
    resetBtn.style.borderRadius = "6px";
    resetBtn.style.border = "none";
    resetBtn.style.cursor = "pointer";
    resetBtn.style.background = "rgba(255,255,255,0.1)";
    resetBtn.style.color = "#fff";
    resetBtn.style.marginTop = "12px";

    resetBtn.addEventListener('mouseenter', () => resetBtn.style.background = "rgba(255,255,255,0.2)");
    resetBtn.addEventListener('mouseleave', () => resetBtn.style.background = "rgba(255,255,255,0.1)");

    resetBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to reset your save? This cannot be undone.")) {
            resetSave();
            location.reload();
        }
    });

    container.appendChild(resetBtn);
}