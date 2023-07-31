import { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "Artificial Unintelligence",
  description:
    "Multiplayer game where players compete against eachother to create the funniest AI-generated images.",
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
        <Analytics />
      </body>
    </html>
  );
}
