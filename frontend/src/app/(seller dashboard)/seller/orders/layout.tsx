import type { Metadata } from "next";
import { Suspense } from "react";
import Loading from "@/app/components/Loading.component";

export const metadata: Metadata = {
  title: "Seller Orders | SAADiCcollection.shop",
  description: "View and manage all customer orders. Track order status, process deliveries, and handle returns on SAADiCcollection.shop.",
  keywords: ["seller orders", "order management", "track orders", "seller dashboard", "SAADiCcollection.shop"],
};


export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
   
        <Suspense fallback={<Loading />}>
          <main className="">{children}</main>
        </Suspense>
     
  );
}
