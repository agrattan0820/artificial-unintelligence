const Footer = () => {
  return (
    <footer className="absolute bottom-8 left-1/2 w-full -translate-x-1/2 text-center">
      <div className="flex flex-col items-center justify-center gap-2 text-xs sm:text-sm">
        <p>
          Free and{" "}
          <a
            href="https://github.com/agrattan0820/artificial-unintelligence"
            className="text-indigo-300 underline"
          >
            open source
          </a>{" "}
          💜
        </p>
        <p>
          Like the game?{" "}
          <a
            href="https://www.buymeacoffee.com/agrattan"
            className="text-indigo-300 underline"
          >
            Donate some cereal
          </a>{" "}
          🥣
        </p>
      </div>
    </footer>
  );
};

export default Footer;
