let injectedTabs = new Set();

chrome.action.onClicked.addListener((tab) => {
  if (!injectedTabs.has(tab.id)) {
    // Inject the content script into the active tab if it hasn't been injected yet
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        files: ["content.js"],
      },
      () => {
        // After the script is injected, send a message to toggle the text
        chrome.tabs.sendMessage(tab.id, { text: "toggle" });
        injectedTabs.add(tab.id);
      }
    );
  } else {
    // If already injected just toggle the text
    chrome.tabs.sendMessage(tab.id, { text: "toggle" });
  }
});

// Listen for tabs being closed or updated and remove them from the set
chrome.tabs.onRemoved.addListener((tabId) => {
  injectedTabs.delete(tabId);
});
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    injectedTabs.delete(tabId);
  }
});
