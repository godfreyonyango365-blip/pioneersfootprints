import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pioneers Footprints",
  description: "Building knowledge, preserving truth, and advancing digital ministry through publications and technology.|",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
