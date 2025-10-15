import type { Metadata } from "next";
import { Suspense } from "react";

import Loading from "@/app/components/Loading.component";
import BuyerNavbarComponent from "@/app/components/navbars/BuyerNavbar.component";


export const metadata: Metadata = {
  title: "Buyer Dashboard | SAADiCcollection.shop",
  description: "Track your orders, manage your profile, and explore exclusive products on SAADiCcollection.shop.",
  keywords: ["buyer dashboard", "order tracking", "account management", "SAADiCcollection.shop"],
};


export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
   
      <Suspense fallback={<Loading />}>
      <BuyerNavbarComponent />
      <main className="p-6">{children}</main>
    </Suspense>
     
  );
}
