import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import React from "react";
import { Menu } from "@/components/Menu";
import Banner from "@/components/Banner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {



  return (
    <html lang="en">
      <body > {/*  className={`${geistSans.variable} ${geistMono.variable} antialiased`} */}
        <div className="px-6 sm:p-8 lg:p-12 py-2">
          <div className="max-w-[430px] mx-auto">
              <Banner message="SMART FARMER" backgroundColor="#5DB9FE" />
              < Menu />
              {children}
          </div>
        </div>
      </body>
    </html>
  );
}