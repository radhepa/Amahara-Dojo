import type { Metadata } from "next";
import "./globals.css";
import "./members.css";
import "./story.css";

export const metadata: Metadata = {
  title: "Dojo",
  description: "Build your practice and a place to belong. A martial arts training RPG with five original companions, an eight-week story, and 30–45 minute beginner sessions around your schedule.",
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
