import type { Metadata } from "next";
import "./globals.css";
import "./members.css";
import "./story.css";
import "./hud.css";
import "./game-feel.css";
import "./training.css";
import "./pilot.css";
import "./settings.css";

export const metadata: Metadata = {
  title: "Dojo",
  description: "Build your practice and a place to belong. A martial arts training RPG with five original companions, an eight-week story, and guided martial arts lessons and beginner practice with built-in rests.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
