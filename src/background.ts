chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "UPDATE_BADGE") {
    chrome.action.setBadgeText({ text: message.text });
  }
});
