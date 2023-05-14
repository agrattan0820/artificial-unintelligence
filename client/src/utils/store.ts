import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type StoreState = {
  nickname: string | null;
  setNickname: (name: string) => void;
};

export const useStore = create<StoreState>()(
  devtools(
    persist(
      (set) => ({
        nickname: null,
        setNickname: (name) => set(() => ({ nickname: name })),
      }),
      {
        name: "storage",
      }
    )
  )
);
