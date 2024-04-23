type InitMessage = {
  type: "init";
};

type ClearIntervalMessage = {
  type: "clearInterval";
};

type GetTabIdMessage = {
  type: "getTabId";
};

type UpdateBadgeMessage = {
  type: "updateBadge";
  text: string;
};

export type Message =
  | InitMessage
  | ClearIntervalMessage
  | GetTabIdMessage
  | UpdateBadgeMessage;
