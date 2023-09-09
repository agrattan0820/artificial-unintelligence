import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useContext, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import useClickAway from "@ai/utils/hooks/use-click-away";
import { SocketContext } from "@ai/utils/socket-provider";

import { FiSettings, FiLogOut } from "react-icons/fi";

type UserMenuProps = {
  session: Session;
  roomCode: string;
};

const UserMenu = ({ session, roomCode }: UserMenuProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const socket = useContext(SocketContext);

  const userMenuRef = useRef<HTMLDivElement>(null);
  useClickAway(userMenuRef, () => {
    setShowMenu(false);
  });

  const handleSignOutAndLeave = () => {
    socket.emit("leaveRoom", {
      userId: session.user.id,
      code: roomCode,
    });
    signOut();
  };

  return (
    <div
      ref={userMenuRef}
      className="relative flex flex-col items-end justify-end"
    >
      <button onClick={() => setShowMenu(!showMenu)}>
        <FiSettings className="text-xl md:text-2xl" />
      </button>
      <AnimatePresence initial={false}>
        {showMenu && (
          <motion.div
            className="mt-4 rounded-md border border-gray-300 bg-slate-900 p-4"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
            }}
            exit={{ opacity: 0 }}
          >
            <ul>
              <li>
                <button
                  onClick={handleSignOutAndLeave}
                  className="flex items-center gap-2 text-sm hover:underline focus:underline md:text-base"
                >
                  Sign Out and Leave Game <FiLogOut />
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;
