import { useState, useCallback } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  parse: (raw: string) => T | null = (raw) => raw as unknown as T
): [T, (value: T) => void] {
  const [stored, setStored] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return initialValue;
      const parsed = parse(item);
      return parsed ?? initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T) => {
      setStored(value);
      try {
        localStorage.setItem(key, String(value));
      } catch {
        // localStorage can throw (quota, private mode) – fail silently
      }
    },
    [key]
  );

  return [stored, setValue];
}
