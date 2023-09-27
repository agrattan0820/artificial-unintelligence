"use client";

import { Dispatch, SetStateAction, createContext } from "react";
import { useStickyState } from "./hooks/use-sticky-state";

export const SoundContext = createContext<{
  soundEnabled: boolean;
  setSoundEnabled: Dispatch<SetStateAction<boolean>>;
}>({
  soundEnabled: true,
  setSoundEnabled: () => {},
});

export default function SoundProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [soundEnabled, setSoundEnabled] = useStickyState(true, "soundEnabled");

  return (
    <SoundContext.Provider value={{ soundEnabled, setSoundEnabled }}>
      {children}
    </SoundContext.Provider>
  );
}
