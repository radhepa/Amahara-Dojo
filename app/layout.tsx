import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Train like Rock Lee · Lee Dojo",
  description: "Your beginner martial arts dojo. Gentle fundamentals, mobility, and discipline around your lifting and running schedule.",
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
