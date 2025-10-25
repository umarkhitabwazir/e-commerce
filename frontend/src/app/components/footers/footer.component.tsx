"use client"
import { JSX, useState, FormEvent } from "react"
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaTelegramPlane,
  FaTwitter,
  FaWhatsapp,
  FaEnvelope,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaCreditCard
} from "react-icons/fa"
import Image from "next/image"
import Link from "next/link"
import PolicyLinksCoponent from "../PolicyLinks.coponent"
import { usePathname } from "next/navigation"

const Footer = () => {
  const [email, setEmail] = useState("")
  const year = new Date().getFullYear()
   const pathName = usePathname();
      const authRoutes = ["/sign-up", "/verify-email", "/reset-password", "/login"];
      const isAuthRoute = authRoutes.includes(pathName);

  const submitNewsletter = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      alert("Please enter a valid email address.")
      return
    }
    alert(`Thanks — ${email} subscribed.`)
    setEmail("")
  }

  return (
    <>
   { 
   !isAuthRoute &&  <footer className="bg-[#0b1721] text-white pt-10 pb-4 px-4 relative font-inter border-t border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Brand */}
          <div className="flex flex-col">
            <div className="flex  gap-4 items-start">
              <div className="bg-white rounded-xl p-2 shadow-lg">
                <Image
                  src="/logo.jpg"
                  alt="Saadi Collections logo"
                  width={90}
                  height={90}
                  className="bg-cover  bg-center rounded-lg"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-xl font-semibold">Saadi Collections</h3>
                <p className="text-gray-400 leading-relaxed text-[1.02rem] max-w-md">
                  Curated ethnic & modern wear, premium fabrics, fair prices and reliable delivery.
                </p>
              </div>
            </div>
          <PolicyLinksCoponent/>

            <div className="flex gap-3 mt-auto text-gray-300 text-xl pt-4">
              <FaCcVisa />
              <FaCcMastercard />
              <FaCcPaypal />
              <FaCreditCard />
            </div>
          </div>

          {/* Location */}
          <div>
            <h4 className="text-lg mb-2">Location</h4>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-3">
              <div className="rounded-lg overflow-hidden bg-black">
                <iframe
                  title="Saadi Collections - chakwal location"
                  src="https://www.google.com/maps?q=chakwal,+Pakistan&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-60 border-0"
                />

              </div>
              <div className="text-gray-200 text-sm leading-tight">
                <strong className="block text-white mb-1">Visit us — chakwal</strong>
                <div>Saadi Collections (Representative)</div>
                <div>chakwal, Punjab, Pakistan</div>
              </div>

            </div>
          </div>

          {/* Newsletter + Social */}
          <div>
            <h4 className="text-lg mb-2">Stay in touch</h4>
            <p className="text-gray-400 mb-3 text-sm">
              Get offers, restocks & early access — unsubscribe anytime.
            </p>

            <form onSubmit={submitNewsletter} className="flex flex-col sm:flex-row gap-2 mb-3">
              <input
                id="sc-newsletter"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white placeholder-white/50 text-sm outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-amber-500 text-[#071327] font-bold hover:-translate-y-[2px] transition"
              >
                Subscribe
              </button>
            </form>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 justify-start mt-2">
              {([
                ["https://wa.me/923165548374", <FaWhatsapp key="wa" />],
                ["https://t.me/SaadiCollection", <FaTelegramPlane key="tg" />],
                ["https://youtube.com/@saadicollection.4469", <FaYoutube key="yt" />],
                ["https://facebook.com/profile.php?id=61579311066499", <FaFacebookF key="fb" />],
                ["https://instagram.com/saadicollection313", <FaInstagram key="ig" />],
                ["https://tiktok.com/@saadi_collection.com", <FaTiktok key="tt" />],
                ["https://x.com/sadicollection1", <FaTwitter key="tw" />],
                ["mailto:saadicollection18@gmail.com", <FaEnvelope key="mail" />],
              ] as [string, JSX.Element][]).map(([link, icon]) => (
                <Link
                  key={link}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center rounded-lg bg-white/5 hover:bg-yellow-400/20 hover:text-yellow-400 transition transform hover:-translate-y-1 shadow-lg"
                >
                  {icon}
                </Link>
              ))}

            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-6 pt-3 flex flex-col sm:flex-row justify-between items-center gap-3 max-w-6xl mx-auto text-gray-400 text-sm">
          <small>© {year} Saadi Collections. All rights reserved.</small>
          <nav className="flex gap-4">
            <Link href="/contact" className="hover:text-yellow-400">Contact</Link>
          </nav>
        </div>

        {/* Back to top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="absolute right-4  bottom-20 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center font-bold hover:bg-yellow-400/20 hover:text-yellow-400 transition"
          title="Back to top"
        >
          ↑
        </button>
      </footer>
}
    </>
  )
}

export default Footer
