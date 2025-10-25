import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Verify Email | SAADiCcollection.shop",
  description:
    "Verify your email address to activate your SAADiCcollection.shop account and start shopping or selling securely.",
  keywords: [
    "verify email",
    "email verification",
    "account activation",
    "secure login",
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
