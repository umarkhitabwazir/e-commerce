import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Shipping Policy | SAADiCcollection.shop",
  description:
    "Read the SAADiCcollection.shop shipping policy to learn about delivery times, shipping methods, and order tracking details.",
  keywords: [
    "shipping policy",
    "delivery information",
    "order tracking",
    "shipping rates",
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
