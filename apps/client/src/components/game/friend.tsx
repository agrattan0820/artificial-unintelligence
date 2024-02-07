import { cn } from "@ai/utils/cn";
import { ClassValue } from "clsx";

const Friend = ({
  className,
  type = "GOOD",
}: {
  className?: ClassValue;
  type?: "GOOD" | "MID" | "SMILING" | "SAD";
}) => {
  switch (type) {
    case "MID": {
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
            d="M29 39C29 39 33.8 39 37 39C40.2 39 45 39 45 39"
            stroke="#A5B4FC"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    }
    case "SAD": {
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
          <circle cx="54" cy="40.4444" r="4" fill="#6B84FA" />
          <path d="M54 32L57.5556 38.6667H50.4168L54 32Z" fill="#6B84FA" />
        </svg>
      );
    }

    case "SMILING": {
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
            d="M36.5 44C30 44 29 39 29 39H44C44 39 43 44 36.5 44Z"
            fill="#A5B4FC"
          />
          <path
            d="M29 39V38C28.7004 38 28.4166 38.1343 28.2267 38.366C28.0367 38.5977 27.9607 38.9023 28.0194 39.1961L29 39ZM44 39L44.9806 39.1961C45.0393 38.9023 44.9633 38.5977 44.7733 38.366C44.5834 38.1343 44.2996 38 44 38V39ZM29 39C28.0194 39.1961 28.0195 39.1967 28.0197 39.1974C28.0197 39.1976 28.0199 39.1983 28.0199 39.1987C28.0201 39.1997 28.0204 39.2007 28.0206 39.2018C28.021 39.2041 28.0216 39.2066 28.0222 39.2094C28.0234 39.2151 28.0248 39.222 28.0266 39.2301C28.0302 39.2463 28.035 39.2672 28.0412 39.2926C28.0535 39.3433 28.0714 39.4119 28.096 39.4959C28.1451 39.6636 28.2214 39.8939 28.3347 40.1659C28.5608 40.7083 28.9386 41.4277 29.5506 42.1476C30.801 43.6187 32.9534 45 36.5 45V43C33.5466 43 31.949 41.8813 31.0744 40.8524C30.6239 40.3223 30.3455 39.7917 30.1809 39.3966C30.0989 39.1999 30.0463 39.0395 30.0154 38.9338C29.9999 38.881 29.9899 38.8422 29.9845 38.8197C29.9817 38.8085 29.9801 38.8013 29.9795 38.7986C29.9792 38.7972 29.9792 38.7969 29.9793 38.7978C29.9794 38.7982 29.9796 38.799 29.9798 38.8C29.9799 38.8005 29.98 38.8011 29.9801 38.8017C29.9802 38.802 29.9803 38.8026 29.9804 38.8027C29.9805 38.8033 29.9806 38.8039 29 39ZM36.5 45C40.0466 45 42.199 43.6187 43.4494 42.1476C44.0614 41.4277 44.4392 40.7083 44.6653 40.1659C44.7786 39.8939 44.8549 39.6636 44.904 39.4959C44.9286 39.4119 44.9465 39.3433 44.9588 39.2926C44.965 39.2672 44.9698 39.2463 44.9734 39.2301C44.9752 39.222 44.9766 39.2151 44.9778 39.2094C44.9784 39.2066 44.979 39.2041 44.9794 39.2018C44.9796 39.2007 44.9799 39.1997 44.9801 39.1987C44.9801 39.1983 44.9803 39.1976 44.9803 39.1974C44.9805 39.1967 44.9806 39.1961 44 39C43.0194 38.8039 43.0195 38.8033 43.0196 38.8027C43.0197 38.8026 43.0198 38.802 43.0199 38.8017C43.02 38.8011 43.0201 38.8005 43.0202 38.8C43.0204 38.799 43.0206 38.7982 43.0207 38.7978C43.0208 38.7969 43.0208 38.7972 43.0205 38.7986C43.0199 38.8013 43.0183 38.8085 43.0155 38.8197C43.0101 38.8422 43.0001 38.881 42.9846 38.9338C42.9537 39.0395 42.9011 39.1999 42.8191 39.3966C42.6545 39.7917 42.3761 40.3223 41.9256 40.8524C41.051 41.8813 39.4534 43 36.5 43V45ZM29 40H44V38H29V40Z"
            fill="#A5B4FC"
          />
        </svg>
      );
    }

    case "GOOD":
    default:
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
  }
};

export default Friend;
