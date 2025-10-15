import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import Loading from "./components/Loading.component";
import PublicNavbar from "./components/navbars/PublicNavbar.component";
import FooterComponent from "./components/footers/footer.component";
import SideWhatsappIconComponent from "./components/SideWhatsappIcon.component";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SAADiCcollection.shop - Your One-Stop Online Store",
  description: "Discover the best deals on electronics, fashion, and more. Shop now for high-quality products at unbeatable prices!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Suspense fallback={<Loading />}>
          <div className="flex flex-col min-h-screen">
            <div className="relative">
              <PublicNavbar />
              <div className="fixed bottom-4 right-4 z-50">
                <SideWhatsappIconComponent />
              </div>
            </div>

            <main className="flex-grow">
              {children}
            </main>

            <FooterComponent />
          </div>
        </Suspense>
      </body>
    </html>
  );
}
