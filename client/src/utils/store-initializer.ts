"use client";

import { useRef } from "react";
import { StoreState, useStore } from "./store";
import { RoomInfo } from "@ai/types/api.type";

type StoreInitializerType = Partial<Pick<StoreState, "room" | "user">>;

const StoreInitializer = ({ room, user }: StoreInitializerType) => {
  const initialized = useRef(false);

  if (!initialized.current) {
    useStore.setState({ room: room, user: user });
    initialized.current = true;
  }

  return null;
};

export default StoreInitializer;
