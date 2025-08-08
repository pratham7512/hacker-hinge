import type { Metadata } from "next";
import { PT_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const hnFont = PT_Sans({ variable: "--font-hn", subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Hacker Hinge",
  description: "Swipe jobs from Hacker News and save your favorites.",
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
