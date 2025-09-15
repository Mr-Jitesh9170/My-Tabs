chrome.runtime.onInstalled.addListener(() => {
    console.log("My-Tabs extension installed!");
}); 
chrome.action.onClicked.addListener((tab) => {
    console.log("Clicked on extension icon!");
    console.log("Active tab is:", tab);
}); 
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message, sender, sendResponse)
    if (message.action === "getCurrentTab") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            sendResponse(tabs[0]);
        });
        return true;
    }
}); 