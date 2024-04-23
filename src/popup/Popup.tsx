import { Flex, Text, Button, Stack, NativeSelect, Box } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { minutes, seconds } from "./constants";
import type { Message } from "../types";
import { getLocalStorage, setLocalStorage } from "../utils";

function App() {
  const form = useForm({
    initialValues: {
      minutes: "0",
      seconds: "0",
    },
  });
  const [tabId, setTabId] = useState(0);

  const getData = async () => {
    const time = await getLocalStorage("time");
    const tabId = await getLocalStorage("tabId");

    if (time) {
      form.setValues(time);
    }

    if (tabId) {
      setTabId(tabId);
    }
  };

  useEffect(() => {
    getData();
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

        await setLocalStorage("time", {
          minutes: values.minutes,
          seconds: values.seconds,
        });

        await setLocalStorage("tabId", tab.id);

        await chrome.tabs.sendMessage<Message>(tab.id, { type: "init" });

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
        <Button
          fullWidth
          size="xs"
          type="submit"
          variant="outline"
          disabled={
            tabId !== 0 ||
            (form.values.minutes === "0" && form.values.seconds === "0")
          }
        >
          このタブで自動更新を開始
        </Button>
        <Button
          fullWidth
          size="xs"
          type="button"
          variant="outline"
          color="red"
          disabled={tabId === 0}
          onClick={async () => {
            const tabId = await getLocalStorage("tabId");

            if (!tabId) {
              return;
            }

            setTabId(0);

            await setLocalStorage("tabId", 0);

            await chrome.action.setBadgeText({
              text: "",
            });

            await chrome.tabs.sendMessage<Message>(tabId, {
              type: "clearInterval",
            });

            window.close();
          }}
        >
          自動更新を停止
        </Button>
      </Stack>
    </form>
  );
}

export default App;
