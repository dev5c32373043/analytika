export function serializeMessageData(data: object): Buffer {
  return Buffer.from(JSON.stringify(data));
}
