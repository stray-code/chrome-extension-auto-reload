import { Message } from "./types";
import { getLocalStorage, setLocalStorage } from "./utils";

chrome.runtime.onMessage.addListener((message: Message, sender, response) => {
  if (message.type === "updateBadge") {
    chrome.action.setBadgeText({
      text: message.text,
    });
  }

  if (message.type === "getTabId") {
    if (!sender.tab) {
      return;
    }

    response(sender.tab.id);
  }
});

chrome.tabs.onRemoved.addListener(async (removedTabId) => {
  const tabId = await getLocalStorage("tabId");

  if (tabId !== removedTabId) {
    return;
  }

  await setLocalStorage("tabId", 0);

  chrome.action.setBadgeText({
    text: "",
  });
});
