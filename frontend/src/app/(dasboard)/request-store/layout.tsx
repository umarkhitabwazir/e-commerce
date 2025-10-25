import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Request a Store | SAADiCcollection.shop",
  description:
    "Submit a request to open your own store on SAADiCcollection.shop and start selling your products online.",
  keywords: [
    "request store",
    "open store",
    "seller registration",
    "become a seller",
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
