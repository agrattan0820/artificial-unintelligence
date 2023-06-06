"use client";

import { cn } from "@ai/utils/cn";
import { useEffect, useState } from "react";

const Timer = () => {
  const [seconds, setSeconds] = useState(90);

  useEffect(() => {
    const interval = setTimeout(() => {
      if (seconds > 0) {
        setSeconds((prev) => prev - 1);
      } else {
        clearTimeout(interval);
      }
    }, 1000);

    return () => {
      clearTimeout(interval);
    };
  }, [seconds]);

  // Source: https://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss
  const timeString = (seconds: number) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    const timeString = date.toISOString().slice(15, 19);
    return timeString;
  };

  return (
    <div
      className={cn(
        "fixed left-8 top-8 flex h-16 w-16 items-center justify-center rounded-full border border-gray-400 transition",
        seconds <= 30 && "border-red-400 text-red-400"
      )}
    >
      {timeString(seconds)}
    </div>
  );
};

export default Timer;
