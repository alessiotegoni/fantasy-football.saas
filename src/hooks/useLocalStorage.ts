"use client";

import { useState, useEffect } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  function setValue(value: T) {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(valueToStore));
      }
      setStoredValue(valueToStore);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const item = localStorage.getItem(key);
        if (item) setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.log(error);
    }
  }, [key]);

  return [storedValue, setValue];
}
