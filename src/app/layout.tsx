import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { customSans } from "./fonts";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Espresso Events Map",
  description: "Espresso events around the world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${customSans.variable} ${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
        {children}
      </body>
    </html>
  );
}
