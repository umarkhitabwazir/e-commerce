import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Reset Password | SAADiCcollection.shop",
  description:
    "Securely reset your SAADiCcollection.shop account password to regain access to your profile and orders.",
  keywords: [
    "reset password",
    "account recovery",
    "password change",
    "forgot password",
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
