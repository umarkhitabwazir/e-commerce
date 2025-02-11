import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "./components/Navbar.component";
import AdminDashboardComponent from "./components/AdminDashboard.component";
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
  title: "Create Next App",
  description: "Generated by create next app",
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
        <div>
          <div className="">

            <Navbar />
          </div>

          <AdminDashboardComponent />

        </div>

          {children}
        </Suspense>
      </body>
    </html>
  );
}
