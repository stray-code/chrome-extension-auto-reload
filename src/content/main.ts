let intervalId: number = 0;

const init = () => {
  chrome.storage.local.get(["AUTO_RELOAD"], async (value) => {
    if (!value?.AUTO_RELOAD) {
      return;
    }

    const { tabId, minutes, seconds } = value.AUTO_RELOAD;

    const currentTabId = await chrome.runtime.sendMessage({
      type: "GET_TAB_ID",
    });

    if (currentTabId !== tabId) {
      return;
    }

    let time = +minutes * 60 + +seconds;

    if (time === 0) {
      return;
    }

    intervalId = setInterval(() => {
      time--;

      chrome.runtime.sendMessage({
        type: "UPDATE_BADGE",
        text: time.toString(),
      });

      if (time <= 0) {
        window.location.reload();
      }
    }, 1000);
  });
};

init();

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "RELOAD") {
    window.location.reload();
  }

  if (message.type === "CLEAR_INTERVAL") {
    clearInterval(intervalId);

    chrome.runtime.sendMessage({
      type: "UPDATE_BADGE",
      text: "",
    });
  }
});
