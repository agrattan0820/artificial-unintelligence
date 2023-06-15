import { useState } from "react";
import useIsMounted from "./use-is-mounted";

export default function useShare(slug: string, callback?: () => void) {
  const [copying, setCopying] = useState(false);
  const isMounted = useIsMounted();

  const link = isMounted
    ? `${window.location.origin}${slug}`
    : `http://localhost:3000${slug}`;

  const onClick = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Join My beeeeeeeep Room`,
          url: link,
        })
        .then(() => {
          console.log(`Thanks for sharing!`);
        })
        .catch(console.error);
    } else {
      const cb = navigator.clipboard;
      if (copying) {
        setCopying(false);
      }
      cb.writeText(link)
        .then(() => {
          setCopying(true);
          callback && callback();
        })
        .catch(console.error);
    }
  };

  return {
    link,
    copying,
    setCopying,
    onClick,
  };
}
