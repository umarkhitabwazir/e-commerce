import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Shipping Details | SAADiCcollection.shop",
  description: "Add or select your delivery address, review order summary, and proceed to payment on SAADiCcollection.shop.",
  keywords: ["shipping", "delivery address", "order summary", "checkout", "buyer shipping", "SAADiCcollection.shop"],
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
