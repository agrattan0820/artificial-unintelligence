"use client";

import Button from "@ai/components/button";
import { useStore } from "@ai/utils/store";

const StartGame = () => {
  const { players } = useStore();

  return (
    <div className="mt-4 flex items-center justify-center">
      <Button disabled={players.length < 2}>
        {players.length < 2 ? "One More Player Required" : "Start Game"}
      </Button>
    </div>
  );
};

export default StartGame;
