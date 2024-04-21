chrome.runtime.onMessage.addListener((message, sender, response) => {
  if (message.type === "UPDATE_BADGE") {
    chrome.action.setBadgeText({ text: message.text });
  }

  if (message.type === "GET_TAB_ID") {
    if (!sender.tab) {
      return;
    }

    response(sender.tab.id);
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.local.get(["AUTO_RELOAD"], async (value) => {
    if (!value?.AUTO_RELOAD) {
      return;
    }

    if (value.AUTO_RELOAD.tabId !== tabId) {
      return;
    }

    chrome.storage.local.set({
      AUTO_RELOAD: {
        tabId: 0,
        minutes: value.AUTO_RELOAD.minutes,
        seconds: value.AUTO_RELOAD.seconds,
      },
    });
  });

  return;
});
