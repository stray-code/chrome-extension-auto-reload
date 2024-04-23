import type { Key, TabId, Time } from "./types";

type Values<T> = T extends "TIME" ? Time : TabId;

export const setLocalStorage = async <T extends Key>(
  key: T,
  values: Values<T>,
) => {
  return chrome.storage.local.set({ [key]: values });
};
