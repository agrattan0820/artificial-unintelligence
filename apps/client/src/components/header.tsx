import { Session } from "next-auth";
import Menu from "./menu";

type HeaderProps = {
  session: Session | null;
};

const Header = ({ session }: HeaderProps) => {
  return (
    <header className="container absolute left-0 right-0 top-4 z-50 mx-auto mt-4 flex justify-end gap-4 px-4 md:top-8">
      <Menu session={session} />
    </header>
  );
};

export default Header;
