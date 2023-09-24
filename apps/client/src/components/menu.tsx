"use client";

import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useContext, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import * as Sentry from "@sentry/nextjs";

import useClickAway from "@ai/utils/hooks/use-click-away";
import { SocketContext } from "@ai/utils/socket-provider";

import { FiSettings, FiLogOut } from "react-icons/fi";

type MenuProps = {
  session: Session;
  roomCode?: string;
};

const Menu = ({ session, roomCode }: MenuProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const socket = useContext(SocketContext);

  const menuRef = useRef<HTMLElement>(null);
  useClickAway(menuRef, () => {
    setShowMenu(false);
  });

  const handleSignOutAndLeave = () => {
    if (roomCode) {
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
        <FiSettings className="text-xl md:text-2xl" />
        <span className="sr-only">Menu</span>
      </button>
      <AnimatePresence initial={false}>
        {showMenu && (
          <motion.ul
            id="main-menu"
            className="mt-4 rounded-md border border-gray-300 bg-slate-900 p-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <li>
              <button
                onClick={handleSignOutAndLeave}
                className="flex items-center gap-2 text-sm hover:underline focus:underline md:text-base"
              >
                Sign Out{roomCode && " and Leave Game"} <FiLogOut />
              </button>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Menu;
