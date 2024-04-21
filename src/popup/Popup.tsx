import { Flex, Text, Button, Stack, NativeSelect, Box } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { minutes, seconds } from "./constants";

function App() {
  const form = useForm({
    initialValues: {
      tabId: 0,
      minutes: "0",
      seconds: "0",
    },
  });

  useEffect(() => {
    chrome.storage.local.get(["AUTO_RELOAD"], (value) => {
      if (!value?.AUTO_RELOAD) {
        return;
      }

      form.setValues(value.AUTO_RELOAD);
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
          AUTO_RELOAD: {
            tabId: tab.id,
            minutes: values.minutes,
            seconds: values.seconds,
          },
        });

        chrome.tabs.sendMessage(tab.id, { type: "RELOAD" });

        window.close();
      })}
    >
      <Stack p="md" w={240} gap="md">
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
            onClick={() => {
              chrome.storage.local.get(["AUTO_RELOAD"], async (value) => {
                if (!value?.AUTO_RELOAD) {
                  return;
                }

                chrome.storage.local.set({
                  AUTO_RELOAD: {
                    tabId: 0,
                    minutes: value.AUTO_RELOAD.minutes,
                    seconds: value.AUTO_RELOAD.seconds,
                  },
                });

                chrome.tabs.sendMessage(form.values.tabId, {
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
