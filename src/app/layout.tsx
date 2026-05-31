import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "letitbingo — Summer bucket list, turned into a game",
  description:
    "Turn your summer bucket list into a shared bingo game. Complete challenges, find people, and share your wins.",
  openGraph: {
    title: "letitbingo",
    description: "A bucket list nobody finishes — turned into a game you play with friends.",
    siteName: "letitbingo",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
