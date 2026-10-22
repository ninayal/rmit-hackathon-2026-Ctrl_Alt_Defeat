
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "AEGIS AI | Security Intelligence",
  description:
    "AI-powered multilingual prompt threat detection and protected actions.",
  applicationName: "AEGIS AI",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
