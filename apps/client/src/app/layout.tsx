import { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import AuthProvider from "@ai/components/auth-provider";
import { cn } from "@ai/utils/cn";
import SoundProvider from "@ai/utils/sound-provider";

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
}: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body
        className={cn(
          spaceMono.variable,
          "scroll-smooth bg-slate-900 font-space text-white antialiased",
        )}
      >
        <Toaster containerStyle={{ textAlign: "center" }} />
        <SoundProvider>
          <AuthProvider>{children}</AuthProvider>
        </SoundProvider>
        <Analytics />
      </body>
    </html>
  );
}
