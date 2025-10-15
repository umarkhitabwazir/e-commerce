import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Payment | SAADiCcollection.shop",
  description: "Choose your payment method and complete your purchase securely on SAADiCcollection.shop.",
  keywords: ["payment", "checkout", "cash on delivery", "credit card", "JazzCash", "buyer payment", "SAADiCcollection.shop"],
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
