import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type StoreState = {
  user: { id: number; nickname: string } | null;
  setUser: (user: { id: number; nickname: string }) => void;
  // nickname: string | null;
  // setNickname: (name: string) => void;
};

export const useStore = create<StoreState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        setUser: (user) => set(() => ({ user: user })),
        // nickname: null,
        // setNickname: (name) => set(() => ({ nickname: name })),
      }),
      {
        name: "storage",
      }
    )
  )
);
