export async function to<T>(promise: Promise<T>): Promise<[null, T] | [any]> {
  return promise.then<[null, T]>((data: T) => [null, data]).catch<[any]>((err: any) => [err]);
}
