/* eslint-disable @next/next/no-img-element */
// Disable @next/next/no-img-element because it breaks dicebear's image randomization

"use client";

import { useContext } from "react";
import Image from "next/image";
import { EventFrom, StateFrom } from "xstate";
import { BsTrophy } from "react-icons/bs";
import { motion, Variants } from "framer-motion";
import type { Session } from "next-auth";

import Crown from "@ai/images/crown.webp";
import { GameInfo, GetGameLeaderboardResponse } from "@ai/app/server-actions";
import { gameMachine } from "./game-machine";
import Button, { LinkSecondaryButton } from "../button";
import { SocketContext } from "@ai/utils/socket-provider";
import { FiDownload } from "react-icons/fi";
import Friend from "./friend";

type LeaderboardProps = {
  gameInfo: GameInfo;
  state: StateFrom<typeof gameMachine>;
  send: (event: EventFrom<typeof gameMachine>) => StateFrom<typeof gameMachine>;
  leaderboard: GetGameLeaderboardResponse | undefined;
  hostId: string | null;
  session: Session;
};

const Leaderboard = ({
  gameInfo,
  leaderboard,
  hostId,
  session,
}: LeaderboardProps) => {
  const socket = useContext(SocketContext);

  // TODO: working mobile image share (likely will have to use base64 images)
  // const { onClick } = useImageShare();

  const currUserIsHost = session.user.id === hostId;

  const leaderboardListVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        delay: 1,
        when: "beforeChildren",
        staggerChildren: 0.3,
      },
    },
  };

  const leaderboardListItemVariants: Variants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
  };

  if (!leaderboard) {
    return null;
  }

  const handlePlayAgainOnClick = () => {
    socket.emit("initiatePlayAnotherGame", gameInfo.game.roomCode);
  };

  return (
    <>
      <div className="mx-auto max-w-2xl pt-16 text-center">
        <div className="mb-16">
          <motion.div className="relative mb-4 flex justify-center">
            <motion.div
              className="absolute top-[-52px]"
              initial={{ rotate: 12, y: -15, opacity: 0 }}
              animate={{ rotate: 3, y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <Image src={Crown} alt="Golden royalty crown" className="w-24" />
            </motion.div>
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Friend className="w-24" />
            </motion.div>
          </motion.div>
          <motion.h2
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-2xl [text-wrap:balance] md:text-4xl"
          >
            Thanks for training with us!
          </motion.h2>
        </div>
        <motion.ol
          className="space-y-6"
          initial="hidden"
          animate="visible"
          variants={leaderboardListVariants}
        >
          {leaderboard.leaderboard.map((result, i) => (
            <motion.li
              key={i}
              className="relative flex items-center justify-center gap-4"
              variants={leaderboardListItemVariants}
            >
              {result.standing}.
              <div className="flex w-full justify-between gap-2 rounded-xl bg-slate-800 p-4 text-left md:text-xl">
                <p className="flex items-center gap-4">
                  <span className="flex items-center gap-2 md:gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-indigo-600 p-1 md:h-12 md:w-12">
                      <img
                        src={`https://api.dicebear.com/7.x/bottts/svg?seed=${result.user.nickname
                          .split(" ")
                          .join("_")}`}
                        alt={`Avatar for ${result.user.nickname}`}
                        width={36}
                        height={36}
                      />
                    </span>
                    {result.user.nickname}{" "}
                  </span>
                </p>
                <p className="flex items-center justify-center gap-4">
                  {result.standing === 1 && (
                    <span className="rounded-full bg-yellow-600 p-2 text-white">
                      <BsTrophy />
                    </span>
                  )}
                  <span>{result.points.toLocaleString()} points</span>
                </p>
              </div>
            </motion.li>
          ))}
        </motion.ol>
        <div className="mt-8 flex flex-col justify-center gap-2 sm:flex-row">
          {currUserIsHost && (
            <Button onClick={handlePlayAgainOnClick}>
              Play Again With Same Players
            </Button>
          )}
          <LinkSecondaryButton href="https://www.buymeacoffee.com/agrattan">
            Donate Cereal to Creator 🥣
          </LinkSecondaryButton>
        </div>
        {!currUserIsHost && (
          <p className="mx-auto mt-4 w-full max-w-sm text-sm">
            If you&apos;d like to play again, ask the host to start another
            game.
          </p>
        )}
      </div>
      <div className="mt-8 md:mx-auto md:w-fit">
        <h2 className="text-lg">Your Game&apos;s Generations</h2>
        <ul className="mt-4 flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {leaderboard.allGenerations.map((generation, i) => (
            <li key={i} className="w-[240px] flex-none">
              <div className="relative overflow-hidden rounded-xl">
                <Image
                  className="aspect-square"
                  src={generation.generation.imageUrl}
                  width={1024}
                  height={1024}
                  alt={`Image generated with the prompt: ${generation.generation.text}`}
                />
                <p className="absolute -left-1 -top-1 max-w-[160px] rounded-b-md rounded-r-md bg-slate-800/75 py-1 pb-2 pl-3 pr-2 pt-3 text-white">
                  {generation.user.nickname}
                </p>
                <a
                  href={generation.generation.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute -right-1 -top-1 block rounded-b-md rounded-l-md bg-slate-800/75 pb-2 pl-2 pr-3 pt-3 text-xl text-white transition hover:ring-2 hover:ring-white"
                >
                  <FiDownload />
                </a>
                {/* TODO: working mobile share for images */}
                {/* <button
                  onClick={() =>
                    onClick(
                      "Check out this AI-generated image from Artificial Unintelligence",
                      generation.generation.imageUrl
                    )
                  }
                  className="absolute -right-1 -top-1 rounded-b-md rounded-l-md bg-slate-800/75 pb-2 pl-2 pr-3 pt-3 text-xl text-white transition hover:ring-2 hover:ring-white md:hidden"
                >
                  <FiDownload />
                </button> */}
              </div>
              <p className="mt-2">{generation.generation.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Leaderboard;
