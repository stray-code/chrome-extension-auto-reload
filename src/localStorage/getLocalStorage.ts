import type { Key, TabId, Time } from "./types";

type Return<T> = T extends "TIME" ? Time : TabId;

export const getLocalStorage = async <T extends Key>(
  key: T,
): Promise<Return<T> | undefined> => {
  return chrome.storage.local.get([key]).then((value) => value[key]);
};
