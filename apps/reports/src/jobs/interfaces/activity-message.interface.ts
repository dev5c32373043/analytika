export interface ActivityMessage {
  action: string;
  payload: { [key: string]: any };
  updates?: { [key: string]: any };
}
