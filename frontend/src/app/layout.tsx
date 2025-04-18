import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "./components/Navbar.component";

import { Suspense } from "react";
import Loading from "./components/Loading.component";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ukbazaar - Your One-Stop Online Store",
  description: "Discover the best deals on electronics, fashion, and more. Shop now for high-quality products at unbeatable prices!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        <Suspense fallback={<Loading />}>
          <div className="relative">
            <div >

              <Navbar />
            </div>


          

          </div>

          {children}
        </Suspense>
      </body>
    </html>
  );
}
