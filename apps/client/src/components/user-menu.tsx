import useClickAway from "@ai/utils/hooks/use-click-away";
import { AnimatePresence, motion } from "framer-motion";
import { signOut } from "next-auth/react";
import { useRef, useState } from "react";

import { FiSettings, FiLogOut } from "react-icons/fi";

const UserMenu = () => {
  const [showMenu, setShowMenu] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  useClickAway(userMenuRef, () => {
    setShowMenu(false);
  });

  return (
    <div
      ref={userMenuRef}
      className="relative flex flex-col items-end justify-end"
    >
      <button onClick={() => setShowMenu(!showMenu)}>
        <FiSettings className="text-2xl" />
      </button>
      <AnimatePresence initial={false}>
        {showMenu && (
          <motion.div
            className="mt-4 rounded-md border border-gray-300 p-4"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
            }}
            exit={{ opacity: 0 }}
          >
            <ul>
              <li>
                <button
                  onClick={() => signOut()}
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
