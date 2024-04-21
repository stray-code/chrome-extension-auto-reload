let intervalId: number = 0;

const init = () => {
  chrome.storage.local.get(["TIME", "TAB_ID"], async (value) => {
    if (!value.TIME || !value.TAB_ID) {
      return;
    }

    const { minutes, seconds } = value.TIME;

    const currentTabId = await chrome.runtime.sendMessage({
      type: "GET_TAB_ID",
    });

    if (currentTabId !== value.TAB_ID) {
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
  if (message.type === "INIT") {
    init();
  }

  if (message.type === "CLEAR_INTERVAL") {
    clearInterval(intervalId);

    chrome.runtime.sendMessage({
      type: "UPDATE_BADGE",
      text: "",
    });
  }
});
