chrome.runtime.onMessage.addListener((message, sender, response) => {
  if (message.type === "UPDATE_BADGE") {
    chrome.action.setBadgeText({
      text: message.text,
    });
  }

  if (message.type === "GET_TAB_ID") {
    if (!sender.tab) {
      return;
    }

    response(sender.tab.id);
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.local.get(["TAB_ID"], async (value) => {
    if (value.TAB_ID !== tabId) {
      return;
    }

    chrome.storage.local.set({
      TAB_ID: 0,
    });

    chrome.action.setBadgeText({
      text: "",
    });
  });
});
