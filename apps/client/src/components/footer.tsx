import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full py-8 lg:absolute lg:bottom-8 lg:left-1/2 lg:-translate-x-1/2 lg:py-0">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 lg:flex-row">
        <div className="flex w-full max-w-sm flex-col items-center justify-center gap-2 md:items-start lg:max-w-full lg:flex-row lg:items-center lg:justify-start">
          <div className="flex flex-col items-center justify-center gap-2 text-center text-xs sm:text-sm md:items-start md:text-left">
            <p>
              Made with 💜 by{" "}
              <a
                href="https://github.com/agrattan0820"
                className="text-indigo-300 underline underline-offset-2"
              >
                Alexander
              </a>
            </p>
            <p>
              Like the game?{" "}
              <a
                href="https://www.buymeacoffee.com/agrattan"
                className="text-indigo-300 underline underline-offset-2"
              >
                Buy me a bowl of cereal
              </a>{" "}
              🥣
            </p>
          </div>
        </div>
        <div className="min-w-[120px]">
          <Link
            href="/privacy-policy"
            className="text-xs text-indigo-300 underline underline-offset-2 sm:text-sm"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
