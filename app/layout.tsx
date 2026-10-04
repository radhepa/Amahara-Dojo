import type { Metadata } from "next";
import "./globals.css";
import "./members.css";

export const metadata: Metadata = {
  title: "Dojo",
  description: "Your personal martial arts dojo. Meet five original training companions and build fundamentals, mobility, and discipline around your schedule.",
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
