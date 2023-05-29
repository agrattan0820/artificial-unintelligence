import { Player, Room, RoomInfo, User } from "@ai/types/api.type";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type StoreState = {
  user: User | null;
  setUser: (user: User | null) => void;
  room: Room | null;
  setRoom: (room: Room) => void;
  players: Player[];
  setPlayers: (players: Player[]) => void;
};

export const useStore = create<StoreState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        setUser: (user) => set(() => ({ user: user })),
        room: null,
        setRoom: (room) => set(() => ({ room: room })),
        players: [],
        setPlayers: (players) => set(() => ({ players: players })),
      }),
      {
        name: "storage",
      }
    )
  )
);
