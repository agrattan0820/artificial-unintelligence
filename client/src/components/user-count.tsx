"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { socket } from "@ai/utils/socket";
import { RoomInfo } from "@ai/types/api.type";
import { useStore } from "@ai/utils/store";

const UserCount = ({ initialCount }: { initialCount: number }) => {
  const [userCount, setUserCount] = useState(initialCount);

  const store = useStore();

  console.log(store);

  const helloMessages = (msg: string) => {
    console.log("received messages!");
    toast(msg);
  };
  const message = (msg: string) => {
    console.log("Received messages:", msg);
    toast(msg);
  };
  const updateRoom = (roomInfo: RoomInfo) => {
    console.log("Received room info:", roomInfo);
    setUserCount(roomInfo.players.length);
  };

  useEffect(() => {
    socket.on("hello", helloMessages);
    socket.on("message", message);
    socket.on("updateRoom", updateRoom);

    return () => {
      socket.off("hello", helloMessages);
      socket.off("message", message);
      socket.off("updateRoom", updateRoom);
    };
  }, []);

  return (
    <div className="rounded-xl border border-gray-300 p-4">
      <p>{userCount.toLocaleString()} Players in room</p>
    </div>
  );
};

export default UserCount;
