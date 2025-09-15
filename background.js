// Runs when extension is installed
chrome.runtime.onInstalled.addListener(() => {
    console.log("My-Tabs extension installed!");
});

// Runs when you click the extension icon
chrome.action.onClicked.addListener((tab) => {
    console.log("Clicked on extension icon!");
    console.log("Active tab is:", tab);
});

// Listen for messages from popup.js or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getCurrentTab") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            sendResponse(tabs[0]);
        });
        return true; // Keep channel open for async response
    }
});


// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getCurrentTab") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            sendResponse(tabs[0]); // send back active tab details
        });
        return true; // keep the message channel open for async response
    }
});


