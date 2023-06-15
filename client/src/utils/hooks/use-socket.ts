"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { URL, socket } from "@ai/utils/socket";
import { Socket, io } from "socket.io-client";
import { useStore } from "@ai/utils/store";
import { User, Room } from "@ai/types/api.type";

type UseSocketProps = {
  roomCode: string;
};

const useSocket = ({ roomCode }: UseSocketProps) => {
  const { user } = useStore();

  const helloMessages = (msg: string) => {
    console.log("received messages!");
    toast(msg);
  };
  const message = (msg: string) => {
    console.log("Received messages:", msg);
    toast(msg);
  };

  useEffect(() => {
    // const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(URL, {
    //   auth: {
    //     userId: user?.id,
    //   },
    // });
    socket.emit("connectToRoom", roomCode);
    socket.on("hello", helloMessages);
    socket.on("message", message);

    return () => {
      socket.off("hello", helloMessages);
      socket.off("message", message);
    };
  }, [roomCode, user?.id]);
};

export default useSocket;
