import { Session } from "next-auth";
import Menu from "./menu";
import Friend from "./game/friend";
import Link from "next/link";

type HeaderProps = {
  session: Session | null;
};

const Header = ({ session }: HeaderProps) => {
  return (
    <header className="container absolute left-0 right-0 top-4 z-50 mx-auto mt-4 flex items-center justify-between gap-4 px-4 md:top-8">
      <Link href="/" className="flex">
        <Friend className="mr-2 w-8" />
        Aritificial Unintelligence
      </Link>
      <Menu session={session} />
    </header>
  );
};

export default Header;
