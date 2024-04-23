type InitMessage = {
  type: "INIT";
};

type ClearIntervalMessage = {
  type: "CLEAR_INTERVAL";
};

type GetTabIdMessage = {
  type: "GET_TAB_ID";
};

type UpdateBadgeMessage = {
  type: "UPDATE_BADGE";
  text: string;
};

export type Message =
  | InitMessage
  | ClearIntervalMessage
  | GetTabIdMessage
  | UpdateBadgeMessage;
