import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Ownership Statement | SAADiCcollection.shop",
  description:
    "Learn about the ownership and rights of SAADiCcollection.shop, including trademarks, content usage, and intellectual property information.",
  keywords: [
    "ownership statement",
    "intellectual property",
    "content rights",
    "SAADiCcollection.shop",
    "legal information"
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
