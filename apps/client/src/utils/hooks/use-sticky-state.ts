"use client";

import { useEffect, useState } from "react";
import useIsMounted from "./use-is-mounted";

export function useStickyState<T>(defaultValue: T, key: string) {
  const isMounted = useIsMounted();

  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    if (isMounted) {
      const stickyValue = window.localStorage.getItem(key);
      setValue(stickyValue ? JSON.parse(stickyValue) : defaultValue);
    }
  }, [defaultValue, isMounted, key]);

  useEffect(() => {
    if (isMounted) {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValue] as const;
}
