import { RoomInfo, User } from "@ai/types/api.type";
import { Database } from "@ai/types/supabase.types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type StoreState = {
  user: User | null;
  setUser: (user: User | null) => void;
  room: RoomInfo | null;
  setRoom: (room: RoomInfo) => void;
  // nickname: string | null;
  // setNickname: (name: string) => void;
};

export const useStore = create<StoreState>()(
  devtools(
    persist(
      (set) => ({
        room: null,
        setRoom: (room) => set(() => ({ room: room })),
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
