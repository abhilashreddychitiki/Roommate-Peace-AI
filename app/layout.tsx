import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Roommate Peace AI",
  description: "Resolve roommate conflicts with AI - calmly, fairly, instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
