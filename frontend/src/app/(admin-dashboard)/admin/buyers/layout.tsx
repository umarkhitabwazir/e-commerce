import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Buyers | SAADiCcollection.shop",
  description:
    "View and manage all registered buyers on SAADiCcollection.shop. Monitor activity, handle account issues, and maintain a secure shopping environment.",
  keywords: [
    "manage buyers",
    "buyer accounts",
    "admin dashboard",
    "user management",
    "SAADiCcollection.shop"
  ],
};





export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (

    <div className="">

      <main className="flex-grow">
        {children}
      </main>
    </div>


  )
}
