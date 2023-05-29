"use client";

import { useRef } from "react";
import { StoreState, useStore } from "./store";
import { RoomInfo } from "@ai/types/api.type";

type StoreInitializerType = Partial<Pick<StoreState, "room" | "user">>;

const StoreInitializer = (props: StoreInitializerType) => {
  const initialized = useRef(false);

  console.log(props);

  if (!initialized.current) {
    useStore.setState(props);
    initialized.current = true;
  }

  return null;
};

export default StoreInitializer;
