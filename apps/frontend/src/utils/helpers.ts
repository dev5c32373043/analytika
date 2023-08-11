export const isArray = Array.isArray;
export const isNumber = (obj): boolean => typeof obj === 'number' && Number.isFinite(obj);
export const isString = (str): boolean => typeof str === 'string';
export const isBoolean = (obj): boolean => typeof obj === 'boolean';
export const isPlainObject = (obj): boolean =>
  typeof obj === 'object' && obj !== null && !isArray(obj) && obj.toString() === '[object Object]';
export const isFunction = (fn): boolean => typeof fn === 'function';
export const isNull = (obj): boolean => obj === null;
export const isDate = (obj): boolean => !isNull(obj) && new Date(obj).toString() !== 'Invalid Date';
export const isUndefined = (obj): boolean => obj === undefined;
export const isCollection = (obj): boolean => isArray(obj) || isPlainObject(obj);

export const isEmpty = (obj): boolean => {
  if (isNumber(obj)) return false;
  if (isArray(obj)) return !obj.length;
  if (isPlainObject(obj)) return !Object.keys(obj).length;
  if (isString(obj)) return !obj.length;
  return true;
};

export const safeParseJson = (jsonStr: string, defaultVal = {}) => {
  try {
    const json = JSON.parse(jsonStr);
    return json;
  } catch (e) {
    return defaultVal;
  }
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: number | null;

  return (...args: Parameters<T>): void => {
    // Clear the previous timeout to prevent immediate execution
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set up a new timeout to execute the function after the specified delay
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const getInitials = (name: string): string => {
  const words = name.split(' ');

  // Only first name provided
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

  // First and last names provided
  const [firstName, lastName] = words;
  const initials = firstName.charAt(0) + lastName.charAt(0);
  return initials.toUpperCase();
};

export const dedupByKey = <T, K>(arr: T[], field: keyof T): T[] => {
  const uniqItems = new Map<K, T>();

  for (const item of arr) {
    const fieldValue = item[field];
    if (!uniqItems.has(fieldValue)) {
      uniqItems.set(fieldValue, item);
    }
  }

  return [...uniqItems.values()];
};

export const history = {
  navigate: null,
  location: null,
};
