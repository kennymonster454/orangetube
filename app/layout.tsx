import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OrangeTube — Different color. Same internet.",
  description: "OrangeTube is a video community with GIFs in comments only."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}