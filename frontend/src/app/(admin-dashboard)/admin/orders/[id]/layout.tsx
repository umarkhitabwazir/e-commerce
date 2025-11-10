import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Admin Order Details | SAADiCcollection.shop",
  description:
    "View detailed information about a specific order as an admin, including products, quantities, payment, and shipping status on SAADiCcollection.shop.",
  keywords: [
    "admin order details",
    "order management",
    "order tracking",
    "admin dashboard",
    "SAADiCcollection.shop"
  ],
};



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
   
                      <main className="flex-grow">
              {children}
            </main>

      
  )
}
