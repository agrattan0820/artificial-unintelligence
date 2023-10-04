import { FaDiscord, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="absolute bottom-8 left-1/2 w-full -translate-x-1/2 text-center">
      <div className="container mx-auto flex items-center justify-between px-4 text-xs sm:text-sm">
        <p>
          Feedback?{" "}
          <a
            href="https://forms.gle/kBkGzU5S4XENNg699"
            className="underline underline-offset-2"
          >
            Fill out our form
          </a>
        </p>
        <div className="flex gap-4">
          <a href="https://discord.gg/MPPADa8cED" className="text-2xl">
            <FaDiscord />
          </a>
          <a href="https://twitter.com/agrattan0820" className="text-2xl">
            <FaTwitter />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
