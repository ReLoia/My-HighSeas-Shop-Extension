function loadHiddenItems() {
    chrome.storage.sync.get(["hiddenItems"], (result) => {
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
    chrome.storage.sync.get(["hiddenItems"], (result) => {
        const hiddenItems = result.hiddenItems || [];

        const updatedItems = hiddenItems.filter((item) => item !== itemTitle);

        chrome.storage.sync.set({hiddenItems: updatedItems}, () => {
            loadHiddenItems();
        });
    });
}

function unhideAllItems() {
    chrome.storage.sync.set({hiddenItems: []}, () => {
        loadHiddenItems();
    });
}


document.getElementById("unhide-all").addEventListener("click", unhideAllItems);

loadHiddenItems();
