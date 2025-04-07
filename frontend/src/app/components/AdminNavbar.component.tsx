import React from 'react'
import useStickyScroll from './UseStickyScroll.component';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AdminNavbarComponent = () => {
    const isSticky = useStickyScroll();
     const pathName = usePathname();
        const authRoutes = ["/sign-up", "/verify-email", "/reset-password", "/login", "/log-out"];
        const isAuthRoute = authRoutes.includes(pathName);
  return (
    <>
    
  {!isAuthRoute&& <nav
   className={`${isSticky ? "fixed top-2 bg-opacity-60 shadow-[0_-4px_10px_rgba(0,0,0,0.4)] " : "relative top-0"}   bg-gray-800 text-white transition-all p-5 flex  gap-3 duration-500 top-0 w-full z-50 `}
   >
       <Link
            href="/create-product"
            className="p-4 py-2 bg-blue-500 text-white font-semibold text-center rounded-md hover:bg-blue-600 transition duration-200 shadow-md"
            >
            Add Product
          </Link>
          <Link
            href="/my-products"
            className=" p-4  py-2 bg-green-500 text-white font-semibold text-center rounded-md hover:bg-green-600 transition duration-200 shadow-md"
            >
            My Products
          </Link>
          <Link
            href="/orderd-products"
            className=" p-4  py-2 bg-green-500 text-white font-semibold text-center rounded-md hover:bg-green-600 transition duration-200 shadow-md"
            >
            orders
          </Link>
          <Link
            href="/log-out"
            className="p-4 py-2 bg-red-500 text-white font-semibold text-center rounded-md hover:bg-red-400 transition duration-200 shadow-md"
            >
            Log-out
          </Link>
            
   </nav>}
            </>
  )
}

export default AdminNavbarComponent
