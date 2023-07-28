import { Metadata } from "next";
import "./globals.css";
import { Space_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-space",
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
        className={`${spaceMono.variable} font-space antialiased dark:bg-slate-900 dark:text-white`}
      >
        <Toaster />
        {children}
      </body>
    </html>
  );
}
