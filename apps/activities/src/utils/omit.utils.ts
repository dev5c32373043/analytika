type AnyObject = { [key: string]: any };

export function omit<T extends AnyObject, K extends keyof T>(obj: T, keysToOmit: K[]): Omit<T, K> {
  const result: AnyObject = {};

  for (const key of Object.keys(obj)) {
    if (!keysToOmit.includes(key as K)) {
      result[key] = obj[key];
    }
  }

  return result as Omit<T, K>;
}
