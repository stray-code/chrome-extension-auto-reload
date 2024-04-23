import type { Message } from "../types";
import { getLocalStorage } from "../utils";

let intervalId: number = 0;

const init = async () => {
  const time = await getLocalStorage("time");
  const tabId = await getLocalStorage("tabId");

  if (!time || !tabId) {
    return;
  }

  const currentTabId = await chrome.runtime.sendMessage<Message>({
    type: "getTabId",
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
      type: "updateBadge",
      text: countTime.toString(),
    });

    if (countTime <= 0) {
      window.location.reload();
    }
  }, 1000);
};

init();

chrome.runtime.onMessage.addListener((message: Message) => {
  if (message.type === "init") {
    init();
    return;
  }

  if (message.type === "clearInterval") {
    clearInterval(intervalId);
  }
});
