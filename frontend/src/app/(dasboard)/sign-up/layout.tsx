import type { Metadata } from "next";



export const metadata: Metadata = {
  title: "Sign Up | SAADiCcollection.shop",
  description: "Create your account to start selling or shopping on SAADiCcollection.shop. Join now to manage products, track orders, and explore deals.",
  keywords: ["sign up", "register", "create account", "seller registration", "buyer registration", "SAADiCcollection.shop"],
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
