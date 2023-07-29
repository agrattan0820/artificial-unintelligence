import { cn } from "@ai/utils/cn";
import { ClassValue } from "clsx";

const Friend = ({ className }: { className: ClassValue }) => {
  return (
    <svg
      className={cn(className)}
      viewBox="0 0 88 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="23.5"
        y="7.5"
        width="64"
        height="50"
        rx="11.5"
        fill="#D9D9D9"
        stroke="#CFCFCF"
      />
      <rect
        x="0.5"
        y="0.5"
        width="75"
        height="59"
        rx="11.5"
        fill="#D9D9D9"
        stroke="#CFCFCF"
      />
      <rect x="10" y="10" width="56" height="40" rx="8" fill="#1E1E1E" />
      <circle cx="26" cy="25" r="8" fill="#A5B4FC" />
      <circle cx="47" cy="25" r="8" fill="#A5B4FC" />
      <path
        d="M29 39C29 39 33.5 42 36.5 42C39.5 42 44 39 44 39"
        stroke="#A5B4FC"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Friend;
