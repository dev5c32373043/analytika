export async function to<T>(promise: Promise<T>): Promise<[null, T] | [any]> {
  return promise.then<[null, T]>((data: T) => [null, data]).catch<[any]>((err: any) => [err]);
}

export const wait = async (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));
