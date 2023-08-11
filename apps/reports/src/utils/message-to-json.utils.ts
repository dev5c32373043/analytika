// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function messageToObject<T>(message: any): T {
  return JSON.parse(message.getData().toString()) as T;
}
