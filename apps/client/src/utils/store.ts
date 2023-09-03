import { Room, User } from "@ai/app/server-actions";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type StoreState = {
  user: User | null;
  setUser: (user: User | null) => void;
  room: Room | null;
  setRoom: (room: Room) => void;
  gameId: number | null;
  setGameId: (gameId: number | null) => void;
  players: User[];
  setPlayers: (players: User[]) => void;
};

export const useStore = create<StoreState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        setUser: (user) => set(() => ({ user: user })),
        room: null,
        setRoom: (room) => set(() => ({ room: room })),
        gameId: null,
        setGameId: (gameId) => set(() => ({ gameId: gameId })),
        players: [],
        setPlayers: (players) => set(() => ({ players: players })),
      }),
      {
        name: "storage",
      },
    ),
  ),
);
