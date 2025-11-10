import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Seller Details | SAADiCcollection.shop",
  description:
    "View detailed information about a specific seller as an admin, including store status, products, and performance on SAADiCcollection.shop.",
  keywords: [
    "admin seller details",
    "seller management",
    "store information",
    "admin dashboard",
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
