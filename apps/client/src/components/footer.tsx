import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full py-8 lg:absolute lg:bottom-8 lg:left-1/2 lg:-translate-x-1/2 lg:py-0">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 lg:flex-row">
        <div className="flex w-full max-w-sm flex-col items-center justify-center gap-4 md:items-start lg:max-w-full lg:flex-row lg:items-center lg:justify-start">
          <a
            href="https://www.producthunt.com/posts/artificial-unintelligence?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-artificial&#0045;unintelligence"
            target="_blank"
          >
            <img
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=419632&theme=neutral"
              alt="Artificial&#0032;Unintelligence - Compete&#0032;to&#0032;create&#0032;the&#0032;funniest&#0032;AI&#0032;images&#0032;in&#0032;this&#0032;party&#0032;game | Product Hunt"
              style={{ width: "250px", height: "54px" }}
              width="250"
              height="54"
            />
          </a>
          <div className="flex flex-col items-start justify-center gap-2 text-left text-xs sm:text-sm">
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
