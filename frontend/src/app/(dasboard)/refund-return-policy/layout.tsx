import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Refund and Return Policy | SAADiCcollection.shop",
  description:
    "Review the SAADiCcollection.shop refund and return policy to understand how refunds, exchanges, and returns are handled for your orders.",
  keywords: [
    "refund policy",
    "return policy",
    "exchange policy",
    "order refund",
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
