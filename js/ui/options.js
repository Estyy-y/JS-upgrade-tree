import { SUFFIXES } from '../constants.js';
import { resetSave } from '../core/save.js';
import { getScientificThreshold, setScientificThreshold } from '../core/settings.js';

export function createOptionsContent(container) {
    container.innerHTML = "";

    const title = document.createElement("h2");
    title.textContent = "Options";
    container.appendChild(title);

    // Navigation
    const tabsNav = document.createElement("div");
    tabsNav.classList.add("tabs-nav");

    const generalTabBtn = document.createElement("button");
    generalTabBtn.textContent = "General";
    generalTabBtn.classList.add("tab-button", "active");

    const dataTabBtn = document.createElement("button");
    dataTabBtn.textContent = "Data";
    dataTabBtn.classList.add("tab-button");

    tabsNav.appendChild(generalTabBtn);
    tabsNav.appendChild(dataTabBtn);
    container.appendChild(tabsNav);

    // Tabs
    const tabsContent = document.createElement("div");
    tabsContent.classList.add("tabs-content");

    const generalTab = document.createElement("div");
    generalTab.classList.add("tab-panel", "active");

    const dataTab = document.createElement("div");
    dataTab.classList.add("tab-panel");

    // General

    const sliderLabel = document.createElement("label");
    sliderLabel.textContent = "Scientific Threshold: e";

    const sliderValue = document.createElement("span");
    sliderValue.textContent = "3";

    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = "3";
    slider.max = "303";
    slider.step = "3";
    slider.classList.add("options-slider");

    slider.value = getScientificThreshold();
    sliderValue.textContent = slider.value + " (" + SUFFIXES[slider.value / 3] + ")"; 

    slider.addEventListener("input", () => {
        sliderValue.textContent = slider.value;
        sliderValue.textContent = slider.value + " (" + SUFFIXES[slider.value / 3] + ")"; 
        setScientificThreshold(slider.value);
    });

    sliderLabel.appendChild(sliderValue);
    generalTab.appendChild(sliderLabel);
    generalTab.appendChild(slider);

    // Data

    const resetBtn = document.createElement("button");
    resetBtn.textContent = "Reset Save";
    resetBtn.classList.add("reset-button");

    resetBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to reset your save? This cannot be undone.")) {
            resetSave();
            location.reload();
        }
    });

    dataTab.appendChild(resetBtn);


    tabsContent.appendChild(generalTab);
    tabsContent.appendChild(dataTab);
    container.appendChild(tabsContent);

    // Tab Switching
    generalTabBtn.addEventListener("click", () => {
        generalTabBtn.classList.add("active");
        dataTabBtn.classList.remove("active");
        generalTab.classList.add("active");
        dataTab.classList.remove("active");
    });

    dataTabBtn.addEventListener("click", () => {
        dataTabBtn.classList.add("active");
        generalTabBtn.classList.remove("active");
        dataTab.classList.add("active");
        generalTab.classList.remove("active");
    });
}