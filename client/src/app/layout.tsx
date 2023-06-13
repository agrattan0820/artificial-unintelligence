import { Metadata } from "next";
import "./globals.css";
import { Inter, Roboto, Space_Mono, Gluten } from "next/font/google";
import { Toaster } from "react-hot-toast";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-space",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["100", "300", "400", "500", "700", "900"],
});
const gluten = Gluten({
  subsets: ["latin"],
  variable: "--font-gluten",
  weight: ["100", "200", "300", "400", "500", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "beeeeeeeep",
  description:
    "Multiplayer Jackbox-style game with an artificial intelligence twist.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${spaceMono.variable} ${inter.variable} ${roboto.variable} ${gluten.variable} font-space dark:bg-slate-900 dark:text-white`}
      >
        <Toaster />
        {children}
      </body>
    </html>
  );
}
