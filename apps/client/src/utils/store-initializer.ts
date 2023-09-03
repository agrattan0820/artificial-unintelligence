"use client";

import { useRef } from "react";
import { StoreState, useStore } from "./store";

type StoreInitializerType = Partial<
  Pick<StoreState, "room" | "user" | "players">
>;

const StoreInitializer = (props: StoreInitializerType) => {
  const initialized = useRef(false);

  if (!initialized.current) {
    useStore.setState((prevState) => {
      return { ...prevState, ...props };
    });
    initialized.current = true;
  }

  return null;
};

export default StoreInitializer;
