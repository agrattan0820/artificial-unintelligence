const Footer = () => {
  return (
    <footer className="w-full text-center absolute bottom-8 left-1/2 -translate-x-1/2">
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
            Send some cereal our way
          </a>{" "}
          🥣
        </p>
      </div>
    </footer>
  );
};

export default Footer;
