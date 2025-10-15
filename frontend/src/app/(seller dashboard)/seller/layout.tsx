import type { Metadata } from "next";
import { Suspense } from "react";
import SellerNavbarComponent from "@/app/components/navbars/SellerNavbar.component";
import Loading from "@/app/components/Loading.component";

export const metadata: Metadata = {
  title: "Seller Dashboard | SAADiCcollection.shop",
  description: "Manage your products, track orders, and monitor performance. Seller dashboard for SAADiCcollection.shop merchants.",
  keywords: ["seller dashboard", "product management", "order tracking", "SAADiCcollection.shop"],
};

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
   
        <Suspense fallback={<Loading />}>
          <SellerNavbarComponent />
          <main className="">{children}</main>
        </Suspense>
     
  );
}
