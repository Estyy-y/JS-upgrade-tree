import { createOptionsContent } from './options.js';

const overlay = document.getElementById("popup-overlay");
const content = document.getElementById("popup-content");
const closeBtn = document.getElementById("close-popup");

// Close popup
closeBtn.addEventListener("click", () => {
    overlay.style.display = "none";
});

// Menu button clicks
document.querySelectorAll(".menu-btn").forEach(button => {
    button.addEventListener("click", () => {
        openPopup(button.dataset.tab);
    });
});

export function openPopup(tab) {
    overlay.style.display = "flex";
    content.innerHTML = "";

    switch(tab) {
        case "options":
            createOptionsContent(content);
            break;
        case "stats":
            //createStatsContent(content);
            break;
        case "achievements":
            //createAchievementsContent(content);
            break;
    }
}