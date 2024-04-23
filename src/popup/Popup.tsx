import { Flex, Text, Button, Stack, NativeSelect, Box } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { minutes, seconds } from "./constants";

function App() {
  const form = useForm({
    initialValues: {
      minutes: "0",
      seconds: "0",
    },
  });
  const [tabId, setTabId] = useState(0);

  const getLocalStorage = async () => {
    const time = await chrome.storage.local
      .get(["TIME"])
      .then((value) => value.TIME);

    const tabId = await chrome.storage.local
      .get(["TAB_ID"])
      .then((value) => value.TAB_ID);

    if (time) {
      form.setValues(time);
    }

    if (tabId) {
      setTabId(tabId);
    }
  };

  useEffect(() => {
    getLocalStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form
      onSubmit={form.onSubmit(async (values) => {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });

        if (!tab.id) {
          return;
        }

        chrome.storage.local.set({
          TIME: {
            minutes: values.minutes,
            seconds: values.seconds,
          },
          TAB_ID: tab.id,
        });

        chrome.tabs.sendMessage(tab.id, { type: "INIT" });

        window.close();
      })}
    >
      <Stack p="md" w={210} gap="md">
        <Box>
          <Text fz="xs">更新間隔</Text>
          <Flex align="center" gap="xs">
            <NativeSelect
              {...form.getInputProps("minutes")}
              size="xs"
              data={minutes}
              rightSection={<Text fz="sm">分</Text>}
            />
            <NativeSelect
              {...form.getInputProps("seconds")}
              size="xs"
              data={seconds}
              rightSection={<Text fz="sm">秒</Text>}
            />
          </Flex>
        </Box>
        {tabId === 0 ? (
          <Button
            fullWidth
            size="xs"
            type="submit"
            variant="outline"
            disabled={
              form.values.minutes === "0" && form.values.seconds === "0"
            }
          >
            このタブで自動更新を開始
          </Button>
        ) : (
          <Button
            fullWidth
            size="xs"
            type="button"
            variant="outline"
            color="red"
            onClick={async () => {
              const tabId = await chrome.storage.local
                .get(["TAB_ID"])
                .then((value) => value.TAB_ID);

              setTabId(0);

              chrome.storage.local.set({
                TAB_ID: 0,
              });

              chrome.action.setBadgeText({
                text: "",
              });

              chrome.tabs.sendMessage(tabId, {
                type: "CLEAR_INTERVAL",
              });
            }}
          >
            自動更新を停止
          </Button>
        )}
      </Stack>
    </form>
  );
}

export default App;
