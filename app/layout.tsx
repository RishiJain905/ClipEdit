import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClipEdit - AI Video Editing",
  description: "Turn long-form videos into viral shorts with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
