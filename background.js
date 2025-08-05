chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "select-function",
      title: "Smart Text Assistant: Choose Function",
      contexts: ["selection"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "select-function") {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["popup.js"]
      });
    }
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "get-selected-function") {
      chrome.storage.sync.get("selectedFunction", (data) => {
        sendResponse({ selectedFunction: data.selectedFunction });
      });
      return true; // cho phép async sendResponse
    }
  });
  
  