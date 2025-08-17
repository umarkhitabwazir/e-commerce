import React from 'react'
import useStickyScroll from './UseStickyScroll.component';
import { usePathname, useRouter } from 'next/navigation';
import AdminNavLinkComponent from './AdminNavBarLink.component';

const AdminNavbarComponent = () => {
    const isSticky = useStickyScroll();
    const router=useRouter()
     const pathName = usePathname();
        const authRoutes = ["/sign-up", "/verify-email", "/reset-password", "/login", "/log-out"];
        const isAuthRoute = authRoutes.includes(pathName);
  return (
  <>
  {!isAuthRoute && (
    <nav className={`${isSticky ? "fixed top-0 bg-opacity-90 backdrop-blur-sm shadow-lg" : "relative bg-gray-800"} text-white transition-all duration-300 w-full z-50 py-3`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Branding */}
          <div className="flex items-center">
            <div onClick={()=>router.push('/')} className="text-xl hover:text-cyan-400 cursor-pointer font-bold tracking-tight">
              Admin<span className="text-cyan-400">Dashboard</span>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div className="flex flex-wrap gap-2">
            <AdminNavLinkComponent 
              href="/create-product" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              }
            >
              Add Product
            </AdminNavLinkComponent>
            
            {/* <AdminNavLinkComponent 
              href="/my-products" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
              }
            >
              My Products
            </AdminNavLinkComponent> */}
            
            <AdminNavLinkComponent
              href="/orderd-products" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                </svg>
              }
            >
              Orders
            </AdminNavLinkComponent>
            
            <AdminNavLinkComponent 
              href="/log-out" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
              }
              isLogout={true}
            >
              Logout
            </AdminNavLinkComponent>
          </div>
        </div>
      </div>
    </nav>
  )}
</>
  )
}

export default AdminNavbarComponent
