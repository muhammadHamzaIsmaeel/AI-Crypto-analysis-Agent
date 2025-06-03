import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Crypto Analysis Agent",
  description:
    "A real-time crypto market dashboard with AI-generated trading analysis using Binance API and Gemini AI.",
  metadataBase: new URL("https://your-live-site-url.com"),
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head />
      <body className="antialiased bg-[#0B0F19] text-white min-h-screen flex flex-col">
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
