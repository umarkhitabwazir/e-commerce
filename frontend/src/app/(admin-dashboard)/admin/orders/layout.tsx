import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Manage Orders | SAADiCcollection.shop",
  description:
    "Admin panel to view, track, and manage all orders on SAADiCcollection.shop. Monitor order status, payments, and deliveries.",
  keywords: [
    "manage orders",
    "admin orders",
    "order tracking",
    "order management",
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
