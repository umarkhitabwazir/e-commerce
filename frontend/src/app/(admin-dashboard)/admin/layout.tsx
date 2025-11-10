import type { Metadata } from "next";
import { Suspense } from "react";
import Loading from "../../components/Loading.component";
import AdminNavbarComponent from "@/app/components/navbars/AdminNavbar.component";


export const metadata: Metadata = {
  title: "Admin Dashboard | SAADiCcollection.shop",
  description:
    "Access the Admin Dashboard to manage users, stores, products, and platform settings on SAADiCcollection.shop.",
  keywords: [
    "admin dashboard",
    "admin control panel",
    "user management",
    "store management",
    "SAADiCcollection.shop"
  ],
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
   
        <Suspense fallback={<Loading/>}>
          <div className="flex flex-col justify-between  h-auto min-h-screen">
            <div className="relative">
              <AdminNavbarComponent/>
              <div className="fixed bottom-4 right-4 z-50">
              </div>
            </div>

            <main className="flex-grow">
              {children}
            </main>
            <div >

            </div>
          </div>
        </Suspense>
      
  )
}
