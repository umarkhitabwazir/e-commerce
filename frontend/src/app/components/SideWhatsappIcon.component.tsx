"use client"
import { usePathname } from 'next/navigation';
import React from 'react';

const SideWhatsappIconComponent = () => {
    const pathname=usePathname();
    const roleRoutes = ["/seller"];
    const isRoleRoute = roleRoutes.some(route => pathname.startsWith(route));
    if(isRoleRoute){
        return null;
    }
    const authRoutes = ["/login" ,"/sign-up","/reset-password","/request-store","/buyer/orders","/buyer/profile",  "/orders", "/seller/orders", "/seller/products"];
    
    if (authRoutes.includes(pathname)) {
        return null;
    }
    //
  return (

    <a
      href="https://wa.me/923409751709"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 rounded-full p-3 shadow-lg hover:bg-green-600 transition-all duration-300"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="white"
      >
        <path d="M20.52 3.48A11.93 11.93 0 0012 0a11.93 11.93 0 00-8.52 3.48A11.93 11.93 0 000 12a11.93 11.93 0 003.48 8.52A11.93 11.93 0 0012 24a11.93 11.93 0 008.52-3.48A11.93 11.93 0 0024 12a11.93 11.93 0 00-3.48-8.52zM12 22a9.9 9.9 0 01-5.19-1.47l-.37-.22-3.85 1 1-3.74-.24-.38A9.9 9.9 0 012 12a9.9 9.9 0 012.91-7.09A9.9 9.9 0 0112 2a9.9 9.9 0 017.09 2.91A9.9 9.9 0 0122 12a9.9 9.9 0 01-2.91 7.09A9.9 9.9 0 0112 22zm5.47-7.37c-.3-.15-1.77-.88-2.05-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.18.2-.35.23-.65.08-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.8-1.67-2.1-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.63-.93-2.23-.25-.6-.5-.52-.68-.52h-.58c-.2 0-.53.08-.8.38-.27.3-1.05 1.03-1.05 2.52s1.08 2.92 1.23 3.12c.15.2 2.12 3.23 5.12 4.53.72.3 1.28.48 1.72.62.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.07-.12-.27-.2-.57-.35z" />
      </svg>
    </a>

  );
};

export default SideWhatsappIconComponent;
