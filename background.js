chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.action === "updateText") {
        chrome.storage.local.set({ lastMessage: message.text });
    }
});
