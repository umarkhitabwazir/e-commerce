import type { Metadata } from "next";


export const metadata:Metadata = {
  title: "My Orders | SAADiCcollection.shop",
  description:
    "View and manage your pending and delivered orders. Access your favorites and cart products on SAADiCcollection.shop.",
  keywords: [
    "buyer orders",
    "pending orders",
    "delivered orders",
    "favorites",
    "cart",
    "SAADiCcollection.shop"
  ],
  
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
