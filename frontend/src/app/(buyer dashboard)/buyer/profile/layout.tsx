import type { Metadata } from "next";
import { Suspense } from "react";
import Loading from "@/app/components/Loading.component";

export const metadata: Metadata = {
  title: "User Profile | SAADiCcollection.shop",
  description: "View and manage your account details, update personal information, and track your activity on SAADiCcollection.shop.",
  keywords: [
    "user profile",
    "account settings",
    "profile management",
    "SAADiCcollection.shop"
  ],
};

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
   
        <Suspense fallback={<Loading />}>
          <main className="">{children}</main>
        </Suspense>
     
  );
}
