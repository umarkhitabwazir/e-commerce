import type { Metadata } from "next";


export const metadata:Metadata = {
  title: "Contact Us | SAADiCcollection.shop",
  description:
    "Get in touch with SAADiCcollection.shop support team for help with orders, products, or account-related questions.",
  keywords: [
    "contact",
    "support",
    "customer service",
    "help center",
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
