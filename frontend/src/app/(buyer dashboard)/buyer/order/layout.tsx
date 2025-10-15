import type { Metadata } from "next";

export const metadata: Metadata = {
title: "Order Details | SAADiCcollection.shop",
  description: "View product details, choose quantity, and proceed to checkout securely on SAADiCcollection.shop.",
  keywords: ["order details", "product information", "checkout", "SAADiCcollection.shop"],
};



export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
   
          <main className="">{children}</main>
     
  );
}
