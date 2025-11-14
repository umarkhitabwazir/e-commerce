"use client"
import { Suspense } from "react";
import Loading from "../../components/Loading.component";
import AdminNavbarComponent from "@/app/components/navbars/AdminNavbar.component";
import useStickyScroll from "@/app/components/UseStickyScroll.component";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const isSticky = useStickyScroll();

  return (
   
        <Suspense fallback={<Loading/>}>
          <div className={` ${isSticky?"pt-60":""} flex flex-col justify-between  h-auto min-h-screen`}>
            <div 
            className={`relative`}>
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
