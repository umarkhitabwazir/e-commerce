import type { Metadata } from "next";



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
   
    
      <main >{children}</main>

     
  );
}
