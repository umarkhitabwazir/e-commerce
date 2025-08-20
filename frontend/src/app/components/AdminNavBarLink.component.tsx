import Link from "next/link";
import { logOut } from "../utils/LogOut";
import { useRouter } from "next/navigation";
const AdminNavLinkComponent = ({
  href,
  icon,
  children,
  isLogout = false
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isLogout?: boolean;
}) =>{
  const router =useRouter()
  return (
  
  <Link
    href={isLogout ? '#' : href}
    onClick={async () => {
      if (isLogout) {
        await logOut()
        return router.push(`/login`)
      }
    }}
    className={`
      flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium
      ${isLogout
        ? "bg-red-500 hover:bg-red-600 text-white"
        : "bg-gray-700 hover:bg-gray-600 text-white"}
      hover:shadow-md hover:-translate-y-0.5
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800
      ${isLogout ? "focus:ring-red-500" : "focus:ring-cyan-500"}
    `}
  >
    {icon}
    <span>{children}</span>
  </Link>
)};


export default AdminNavLinkComponent