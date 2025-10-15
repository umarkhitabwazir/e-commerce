"use client"
import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const FooterComponent = () => {
  const pathName=usePathname()
  const authRoutes = ["/login", "/sign-up","/reset-password"];
  return (
   !authRoutes.includes(pathName) &&
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">

        {/* Left Section */}
        <div className="flex flex-col items-center md:items-start space-y-2">
          <h2 className="text-lg font-semibold text-white">SaadiCollection.shop</h2>
          <div className="flex items-center gap-2">
            {/* Phone Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 5.5A2.5 2.5 0 014.5 3h2A2.5 2.5 0 019 5.5V7a2.5 2.5 0 01-2.5 2.5H6v1a11 11 0 0011 11h1a2.5 2.5 0 012.5 2.5V21a2.5 2.5 0 01-2.5 2.5h-2A18.5 18.5 0 012 5.5z" />
            </svg>
            <span>+92 340 9751709</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Email Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m8 0l-8 5m8-5l-8-5m0 10V7m8 10V7" />
            </svg>
            <span>saadicollection18@gmail.com</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-5">
          <Link href="https://t.me/SaadiCollection_Shop" target="_blank" aria-label="Telegram">
            <img src="/telegram.svg" alt="Telegram" className="w-6 h-6 hover:opacity-80" />
          </Link>

          <Link href="https://youtube.com/@saadicollection.4469?si=VviirPubSNf05Oh_" target="_blank" aria-label="YouTube">
            <img src="/youtube.svg" alt="YouTube" className="w-6 h-6 hover:opacity-80" />
          </Link>

          <Link href="https://www.instagram.com/saadicollection313?igsh=Z2k4eHBzcmdtNGI3" target="_blank" aria-label="Instagram">
            <img src="/instagram.svg" alt="Instagram" className="w-6 h-6 hover:opacity-80" />
          </Link>

          <Link href="https://www.facebook.com/share/169ozQFNQB/" target="_blank" aria-label="Facebook">
            <img src="/facebook.svg" alt="Facebook" className="w-6 h-6 hover:opacity-80" />
          </Link>

          <Link href="https://www.tiktok.com/@saadicollection.shop?_t=ZS-90UQsaq7AFr&_r=1" target="_blank" aria-label="TikTok">
            <img src="/tiktok.svg" alt="TikTok" className="w-6 h-6 hover:opacity-80" />
          </Link>

          <Link href="https://wa.me/923409751709" target="_blank" aria-label="WhatsApp">
            <img src="/whatsapp.svg" alt="WhatsApp" className="w-6 h-6 hover:opacity-80" />
          </Link>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 mt-6 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} Saadi Collection. All rights reserved.
      </div>
    </footer>
  )
}

export default FooterComponent
