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
