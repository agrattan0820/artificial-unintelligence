const Footer = () => {
  return (
    <footer className="absolute bottom-8 left-1/2 w-full -translate-x-1/2 text-center">
      <div className="mx-auto flex w-full items-center justify-center gap-4">
        <a
          href="https://www.producthunt.com/posts/artificial-unintelligence?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-artificial&#0045;unintelligence"
          target="_blank"
          className="hidden lg:inline-block"
        >
          <img
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=419632&theme=neutral"
            alt="Artificial&#0032;Unintelligence - Compete&#0032;to&#0032;create&#0032;the&#0032;funniest&#0032;AI&#0032;images&#0032;in&#0032;this&#0032;party&#0032;game | Product Hunt"
            style={{ width: "250px", height: "54px" }}
            width="250"
            height="54"
          />
        </a>
        <div className="flex flex-col items-center justify-center gap-2 text-left text-xs sm:text-sm lg:items-start">
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
    </footer>
  );
};

export default Footer;
