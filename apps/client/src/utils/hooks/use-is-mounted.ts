"use client";

import { useEffect, useState } from "react";

const useIsMounted = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentionally setting mounted state on mount
    setIsMounted(true);
  }, []);

  return isMounted;
};

export default useIsMounted;
