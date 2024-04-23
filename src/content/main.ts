import type { Message } from "../types";

let intervalId: number = 0;

const init = async () => {
  const time = await chrome.storage.local
    .get(["TIME"])
    .then((value) => value.TIME);

  const tabId = await chrome.storage.local
    .get(["TAB_ID"])
    .then((value) => value.TAB_ID);

  if (!time || !tabId) {
    return;
  }

  const currentTabId = await chrome.runtime.sendMessage<Message>({
    type: "GET_TAB_ID",
  });

  if (currentTabId !== tabId) {
    return;
  }

  let countTime = +time.minutes * 60 + +time.seconds;

  if (countTime === 0) {
    return;
  }

  intervalId = setInterval(() => {
    countTime--;

    chrome.runtime.sendMessage<Message>({
      type: "UPDATE_BADGE",
      text: countTime.toString(),
    });

    if (countTime <= 0) {
      window.location.reload();
    }
  }, 1000);
};

init();

chrome.runtime.onMessage.addListener((message: Message) => {
  if (message.type === "INIT") {
    init();
    return;
  }

  if (message.type === "CLEAR_INTERVAL") {
    clearInterval(intervalId);
  }
});
