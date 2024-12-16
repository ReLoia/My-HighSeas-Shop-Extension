function setupHideButtons(items) {
    Array.from(items).forEach((item) => {
        const title = item.querySelector(".tracking-tight").textContent.trim();

        item.style.position = "relative";

        const hideButton = document.createElement("button");
        hideButton.textContent = "Hide";
        hideButton.style.padding = "0 5px";
        hideButton.style.backgroundColor = "#f00";
        hideButton.style.borderRadius = "20px";
        hideButton.style.cursor = "pointer";
        hideButton.style.position = "absolute";
        hideButton.style.top = "5px";
        hideButton.style.right = "5px";

        hideButton.addEventListener("click", () => {
            chrome.storage.sync.get(["hiddenItems"], (result) => {
                const hiddenItems = result.hiddenItems || [];

                if (!hiddenItems.includes(title)) {
                    hiddenItems.push(title);

                    chrome.storage.sync.set({hiddenItems}, () => {
                        item.style.display = "none";
                    });
                }
            });
        });

        item.appendChild(hideButton);
    });
}

function checkForShopPage() {
    const CURRENT_URL = window.location.href;

    if (CURRENT_URL.includes("/shop")) {
        const items = document.querySelector("#region-select").parentElement.querySelector(".grid").children;
        setupHideButtons(items);

        chrome.storage.sync.get(["hiddenItems"], (result) => {
            const hiddenItems = result.hiddenItems || [];

            Array.from(items).forEach((item) => {
                const title = item.querySelector(".tracking-tight").textContent.trim();

                if (hiddenItems.includes(title)) {
                    item.style.display = "none";
                }
            });
        });
    }
}

let previousUrl = window.location.href;

const observer = new MutationObserver(() => {
    const currentUrl = window.location.href;

    if (currentUrl !== previousUrl) {
        previousUrl = currentUrl;
        checkForShopPage();
    }
});

observer.observe(document.body, {childList: true, subtree: true});

checkForShopPage();