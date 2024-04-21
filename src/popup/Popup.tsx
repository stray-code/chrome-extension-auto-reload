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

  useEffect(() => {
    chrome.storage.local.get(["TIME", "TAB_ID"], (value) => {
      if (!value.TIME) {
        return;
      }

      form.setValues(value.TIME);

      if (!value.TAB_ID) {
        return;
      }

      setTabId(value.TAB_ID);
    });
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
      <Stack p="md" w={160} gap="md">
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
        <Flex justify="space-between">
          <Button
            size="xs"
            type="button"
            variant="outline"
            color="red"
            disabled={tabId === 0}
            onClick={() => {
              chrome.storage.local.get(["TAB_ID"], async (value) => {
                if (!value.TAB_ID) {
                  return;
                }

                setTabId(0);

                chrome.storage.local.set({
                  TAB_ID: 0,
                });

                chrome.tabs.sendMessage(value.TAB_ID, {
                  type: "CLEAR_INTERVAL",
                });
              });
            }}
          >
            停止
          </Button>
          <Button size="xs" type="submit" variant="outline">
            開始
          </Button>
        </Flex>
      </Stack>
    </form>
  );
}

export default App;
