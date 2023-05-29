"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import supabase from "@ai/utils/supabase";
import { useStore } from "@ai/utils/store";

const UserCount = ({
  code,
  initialCount,
}: {
  code: string;
  initialCount: number;
}) => {
  const { user, room, players } = useStore();

  console.log("USER", user);
  console.log("ROOM", room);
  console.log("PLAYERS", players);

  return (
    <div className="rounded-xl border border-gray-300 p-4">
      <p>{players.length.toLocaleString()} / 8 Players</p>
    </div>
  );
};

export default UserCount;
