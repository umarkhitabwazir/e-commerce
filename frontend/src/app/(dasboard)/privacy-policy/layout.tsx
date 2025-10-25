import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Privacy Policy | SAADiCcollection.shop",
  description:
    "Read the SAADiCcollection.shop privacy policy to understand how we collect, use, and protect your personal information.",
  keywords: [
    "privacy policy",
    "data protection",
    "user information",
    "security",
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
