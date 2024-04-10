import { Switch, Flex, Text, Button, Stack, NativeSelect } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { minutes, seconds } from "./constants";

function App() {
  const form = useForm({
    initialValues: {
      minutes: "0",
      seconds: "0",
      enabled: false,
    },
    transformValues: (values) => {
      return {
        minutes: +values.minutes,
        seconds: +values.seconds,
        enabled: values.enabled,
      };
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
        chrome.storage.local.set({
          AUTO_RELOAD: values,
        });

        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });

        if (!tab.id) {
          return;
        }

        chrome.tabs.sendMessage(tab.id, { type: "RELOAD" });

        window.close();
      })}
    >
      <Stack p="md" w={240} gap="md">
        <Flex justify="flex-end" align="center">
          <Switch
            label="有効にする"
            {...form.getInputProps("enabled", { type: "checkbox" })}
          />
        </Flex>
        <Flex align="center">
          <NativeSelect data={minutes} {...form.getInputProps("minutes")} />
          <Text ml="xs" mr="md">
            分
          </Text>
          <NativeSelect data={seconds} {...form.getInputProps("seconds")} />
          <Text ml="xs">秒</Text>
        </Flex>
        <Flex justify="flex-end">
          <Button type="submit">保存</Button>
        </Flex>
      </Stack>
    </form>
  );
}

export default App;
