"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import useStickyScroll from "../UseStickyScroll.component";
import { logOut } from "@/app/utils/LogOut";
import Image from "next/image";

const links = [
  { name: "Dashboard", href: "/admin" },
  { name: "Approve Stores", href: "/admin/approve-stores" },
  { name: "Buyers", href: "/admin/buyers" },
  { name: "sellers", href: "/admin/manage-sellers" },
  { name: "Orders", href: "/admin/orders" },
  // { name: "Reports", href: "/admin/reports" },
];

export default function AdminNavbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const isSticky = useStickyScroll()
  const router = useRouter()
  return (
    <nav
      className={`${isSticky
        ? "fixed top-0 bg-amber-200 bg-opacity-70 backdrop-blur-lg shadow-lg"
        : "relative bg-white"} text-white transition-all duration-300 w-full z-50 p-2`}

    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center">
        <div onClick={() => router.push('/admin')} 
        className="text-xl flex flex-wrap select-none flex-col text-black hover:text-cyan-400   rounded-xl justify-center items-center  cursor-pointer font-bold tracking-tight">
          <div >
            <Image
              src="/logo.jpg"
              alt="Logo"
              width={70}
              height={70}
              className="w-[70px] h-[70px] object-center border border-cyan-500 hover:border-cyan-300 rounded-full  "
            />

          </div>

          <div className="overflow-hidden whitespace-nowrap">
            <div className="inline-block animate-marquee   text-[15px] font-semibold tracking-wide">
              SAADI<span className="">collection</span>
             <span className="text-cyan-500 text-[11px] font-medium ml-0.5">.shop</span>

            </div>
          </div>
        </div>




        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 hover:text-blue-600"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center space-x-6">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`${pathname === link.href
                  ? "text-blue-600 font-medium"
                  : "text-gray-600 hover:text-blue-600"
                  } select-none`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <button
          onClick={async () => {
            await logOut()
            return router.push('/login')
          }}
          className="hidden md:block text-red-600 select-none hover:text-red-700 font-medium">
          Logout
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden  border-t border-gray-200 shadow-lg">
          <ul className="grid grid-cols-[repeat(auto-fill,_minmax(100px,_1fr))] gap-2 p-3">
            {links.map((link) => (
              <li key={link.href} className="flex">
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`
            flex-1 flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200
            ${pathname === link.href
                      ? "bg-blue-50 text-blue-600 font-semibold border border-blue-100"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-50 active:bg-gray-100"
                    }
          `}
                >
                  <span className="text-sm font-medium text-center leading-tight">
                    {link.name}
                  </span>
                </Link>
              </li>
            ))}
            <li className="flex">
              <button
                onClick={() => {
                  // Add your logout logic here
                  setMenuOpen(false);
                }}
                className="flex-1 flex flex-col items-center justify-center p-3 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 active:bg-red-100 border border-transparent hover:border-red-100 transition-all duration-200 font-medium"
              >
                <span
                  onClick={async () => {
                    await logOut()
                    return router.push('/login')

                  }}
                  className="text-sm text-center leading-tight">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
