import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import HeaderLayout from "@/components/Header";

const mainFont = localFont({
  src: "./fonts/bpg_glaho.ttf",
  variable: "--font-main",
});

export const metadata: Metadata = {
  title: "Palace of Cognition",
  description: "A place for articles, books, and movies.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ka" className={mainFont.variable}>
      <body className="font-main">
        <div className="content-container">
          <HeaderLayout />
          {children}
        </div>
      </body>
    </html>
  );
}
