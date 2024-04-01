const init = () => {
  chrome.runtime.sendMessage({
    type: "UPDATE_BADGE",
    text: "",
  });

  chrome.storage.local.get(["AUTO_RELOAD"], (value) => {
    if (!value?.AUTO_RELOAD) {
      return;
    }

    const { minutes, seconds, enabled } = value.AUTO_RELOAD;

    if (!enabled) {
      return;
    }

    let time = minutes * 60 + seconds;

    if (time === 0) {
      return;
    }

    setInterval(() => {
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
});
