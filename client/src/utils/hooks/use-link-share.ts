import { useState } from "react";
import useIsMounted from "./use-is-mounted";

type UseLinkShareProps =
  | {
      title: string;
      customLink: string;
      slug?: never;
      callback?: () => void;
    }
  | {
      title: string;
      customLink?: never;
      slug: string;
      callback?: () => void;
    };

export default function useLinkShare({
  title,
  customLink,
  slug,
  callback,
}: UseLinkShareProps) {
  const [copying, setCopying] = useState(false);
  const isMounted = useIsMounted();

  const link = isMounted
    ? `${window.location.origin}${slug}`
    : `http://localhost:3000${slug}`;

  const onClick = () => {
    if (navigator.canShare({ url: link })) {
      navigator
        .share({
          title: title,
          url: customLink ?? link,
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
