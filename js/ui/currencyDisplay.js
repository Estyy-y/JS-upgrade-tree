export function createCurrencyDisplay(player) {
    const display = document.createElement("div");
    const left = document.createElement("div");
    const right = document.createElement("div");

    display.id = "currency-display";
    left.id = "currency-display-left";
    right.id = "currency-display-right";

    display.appendChild(left);
    display.appendChild(right);
    document.body.appendChild(display);

    function update() {
        const power = player.currency.power;

        const formattedAmount =
            EternalNotations.HTMLPresets.Default.format(
                power.amount.floor()
            );

        const formattedPerSecond =
            EternalNotations.HTMLPresets.Default.format(
                power.perSecond.floor()
            );

        left.innerHTML = `
            <div class="currency-amount">
                ${formattedAmount}
            </div>
            <div class="currency-per-second">
                ${formattedPerSecond}/s
            </div>
        `;

        right.innerHTML = `<span class="currency-symbol-display">₽</span>`;
    }

    update();
    return { display, update };
}