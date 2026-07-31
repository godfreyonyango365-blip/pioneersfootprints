import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.pioneersfootprints.com"),

  title: {
    default: "Pioneers Footprints",
    template: "%s | Pioneers Footprints",
  },

  description:
    "Publications, Medical, Digital Ministry - Preserving Pioneer Legacy.",

  keywords: [
    "Pioneers Footprints",
    "Publishing",
    "Medical Missionary",
    "Digital Ministry",
    "Literature Evangelism",
    "Christian Books",
    "Bible",
    "Ellen G. White",
  ],

  authors: [{ name: "Pioneers Footprints" }],
  creator: "Pioneers Footprints",
  publisher: "Pioneers Footprints",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.pioneersfootprints.com",
    siteName: "Pioneers Footprints",
    title: "Pioneers Footprints",
    description:
      "Publications, Medical, Digital Ministry - Preserving Pioneer Legacy.",
    images: [
      {
        url: "/assets/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Pioneers Footprints Logo",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Pioneers Footprints",
    description:
      "Publications, Medical, Digital Ministry - Preserving Pioneer Legacy.",
    images: ["/assets/logo.jpg"],
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
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