import { getLocalStorage, setLocalStorage } from "./localStorage";
import { Message } from "./types";

chrome.runtime.onMessage.addListener((message: Message, sender, response) => {
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

chrome.tabs.onRemoved.addListener(async (removedTabId) => {
  const tabId = await getLocalStorage("TAB_ID");

  if (tabId !== removedTabId) {
    return;
  }

  await setLocalStorage("TAB_ID", 0);

  chrome.action.setBadgeText({
    text: "",
  });
});
