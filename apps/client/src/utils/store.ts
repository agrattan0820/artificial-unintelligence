import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type StoreState = {
  gameId: number | null;
  setGameId: (gameId: number | null) => void;
};

export const useStore = create<StoreState>()(
  devtools(
    persist(
      (set) => ({
        gameId: null,
        setGameId: (gameId) => set(() => ({ gameId: gameId })),
      }),
      {
        name: "storage",
      },
    ),
  ),
);
