"use client";

import type { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useContext, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import * as Sentry from "@sentry/nextjs";

import useClickAway from "@ai/utils/hooks/use-click-away";
import { SocketContext } from "@ai/utils/socket-provider";

import {
  FiSettings,
  FiLogOut,
  FiX,
  FiVolume2,
  FiVolumeX,
  FiUser,
} from "react-icons/fi";
import { useStickyState } from "@ai/utils/hooks/use-sticky-state";
import Link from "next/link";

type MenuProps = {
  session: Session | null;
  roomCode?: string;
};

const Menu = ({ session, roomCode }: MenuProps) => {
  const socket = useContext(SocketContext);
  const [showMenu, setShowMenu] = useState(false);
  const [soundEnabled, setSoundEnabled] = useStickyState(true, "soundEnabled");

  const menuRef = useRef<HTMLElement>(null);
  useClickAway(menuRef, () => {
    setShowMenu(false);
  });

  const handleToggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  const handleSignOutAndLeave = () => {
    if (roomCode && session) {
      socket.emit("leaveRoom", {
        userId: session.user.id,
        code: roomCode,
      });
    }
    Sentry.setUser(null);
    signOut();
  };

  return (
    <nav
      ref={menuRef}
      aria-label="Main menu"
      className="relative flex flex-col items-end justify-end"
    >
      <button
        aria-expanded={showMenu}
        aria-controls="main-menu"
        onClick={() => setShowMenu(!showMenu)}
      >
        {!showMenu ? (
          <FiSettings className="text-xl md:text-2xl" />
        ) : (
          <FiX className="text-xl md:text-2xl" />
        )}
        <span className="sr-only">Menu</span>
      </button>
      <AnimatePresence initial={false}>
        {showMenu && (
          <motion.ul
            id="main-menu"
            className="absolute right-0 top-4 mt-4 flex w-48 flex-col gap-4 rounded-md border border-gray-300 bg-slate-900 p-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {session && (
              <li>
                <Link
                  href="/account"
                  className="flex items-center gap-4 text-sm focus-within:underline hover:underline md:text-base"
                >
                  <FiUser /> My Account
                </Link>
              </li>
            )}
            <li>
              <button
                onClick={handleToggleSound}
                className="flex items-center gap-4 text-sm focus-within:underline hover:underline md:text-base"
              >
                {soundEnabled ? <FiVolumeX /> : <FiVolume2 />}
                {soundEnabled ? "Mute" : "Enable"} Sound{" "}
              </button>
            </li>
            {session && (
              <li>
                <button
                  onClick={handleSignOutAndLeave}
                  className="flex items-center gap-4 text-sm focus-within:underline hover:underline md:text-base"
                >
                  <FiLogOut />
                  Sign Out
                </button>
              </li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Menu;
