import type { Metadata } from "next";
import { PT_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const hnFont = PT_Sans({ variable: "--font-hn", subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "HackerHinge",
  description: "Swipe jobs from Hacker News and save your favorites.",
  metadataBase: new URL("https://hacker-hinge.vercel.app"),
  openGraph: {
    type: "website",
    url: "https://hacker-hinge.vercel.app",
    title: "HackerHinge",
    description: "Swipe jobs from Hacker News and save your favorites.",
    images: [
      {
        url: "https://opengraph.b-cdn.net/production/images/634eb015-beae-4dcd-bb3d-fec051190197.png?token=KWOIZWqvN_8QX4VQ_7ozQeZexm15IGqoNyZFinEx1Yg&height=728&width=1122&expires=33290686237",
        width: 1122,
        height: 728,
        alt: "HackerHinge",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HackerHinge",
    description: "Swipe jobs from Hacker News and save your favorites.",
    images: [
      "https://opengraph.b-cdn.net/production/images/634eb015-beae-4dcd-bb3d-fec051190197.png?token=KWOIZWqvN_8QX4VQ_7ozQeZexm15IGqoNyZFinEx1Yg&height=728&width=1122&expires=33290686237",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${hnFont.variable} antialiased`} style={{ fontFamily: 'var(--font-hn), system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"' }}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
