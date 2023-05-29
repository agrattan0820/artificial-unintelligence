"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import supabase from "@ai/utils/supabase";

const UserCount = ({
  code,
  initialCount,
}: {
  code: string;
  initialCount: number;
}) => {
  const [userCount, setUserCount] = useState(initialCount);

  useEffect(() => {
    const channel = supabase
      .channel(code)
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        console.log(key, newPresences);
        setUserCount((prev) => prev + 1);
        console.log("HELLOOOOO????");
      })
      .on("presence", { event: "leave" }, ({ leftPresences }) => {
        setUserCount((prev) => prev - 1);
      })
      .subscribe();

    console.log("code", code);
    console.log("channel", channel);

    return () => {
      supabase.removeChannel(channel);
    };
  }, [code]);

  return (
    <div className="rounded-xl border border-gray-300 p-4">
      <p>{userCount.toLocaleString()} Players in room</p>
    </div>
  );
};

export default UserCount;
