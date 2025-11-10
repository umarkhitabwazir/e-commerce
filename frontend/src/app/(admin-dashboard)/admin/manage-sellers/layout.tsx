import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Manage Sellers | SAADiCcollection.shop",
  description:
    "View, approve, or remove sellers from the platform. Manage seller accounts and performance on SAADiCcollection.shop.",
  keywords: [
    "manage sellers",
    "seller dashboard",
    "admin sellers",
    "seller management",
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
