browser.tabs.query({active: true, currentWindow: true}, function (tab) {
    if (!tab[0].url || !tab[0].url.includes("https://highseas.hackclub.com/")) {
        browser.tabs.create({url: "https://highseas.hackclub.com/shop"});
        window.close();
    }
});


function loadHiddenItems() {
    browser.storage.sync.get(["hiddenItems"], (result) => {
        if (!result) return;

        const hiddenItems = result.hiddenItems || [];
        const itemsList = document.getElementById("hidden-items-list");

        itemsList.innerHTML = "";

        if (hiddenItems.length === 0) {
            const noItemsMessage = document.createElement("li");
            noItemsMessage.textContent = "No hidden items.";
            itemsList.appendChild(noItemsMessage);
        } else {
            hiddenItems.forEach((item) => {
                const listItem = document.createElement("li");
                listItem.textContent = item;

                const unhideButton = document.createElement("button");
                unhideButton.textContent = "Unhide";
                unhideButton.addEventListener("click", () => {
                    unhideItem(item);
                });

                listItem.appendChild(unhideButton);
                itemsList.appendChild(listItem);
            });
        }
    });
}

function unhideItem(itemTitle) {
    browser.storage.sync.get(["hiddenItems"], (result) => {
        const hiddenItems = result.hiddenItems || [];

        const updatedItems = hiddenItems.filter((item) => item !== itemTitle);

        browser.storage.sync.set({hiddenItems: updatedItems}, () => {
            browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
                browser.tabs.sendMessage(tabs[0].id, {action: "unhideItem", itemTitle}, (response) => {
                    console.error(response?.status || "Failed to notify content script.");
                });
            });

            loadHiddenItems();
        });
    });
}

function unhideAllItems() {
    browser.storage.sync.set({hiddenItems: []}, () => {
        browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
            browser.tabs.sendMessage(tabs[0].id, {action: "unhideAll"}, (response) => {
                console.error(response?.status || "Failed to notify content script.");
            });
        });

        loadHiddenItems();
    });
}


document.getElementById("unhide-all").addEventListener("click", unhideAllItems);

loadHiddenItems();