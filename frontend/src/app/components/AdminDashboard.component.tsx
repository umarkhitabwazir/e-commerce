"use client"
import Link from "next/link";
import React from "react";
import withAuth from "../utils/withAuth";
import { usePathname } from "next/navigation";
type user= {
  username: string
  email: string
  fullName: string
  role: string
  password: string
  address: string
  phone: number

}
const AdminDashboardComponent = ({ user }: { user:user }) => {
  console.log("user", user)
  let role = ["admin", "superadmin"]
  let pathName = usePathname()
  let route = ["/login","/log-out"]
  let auth = route.includes(pathName)
  console.log("pathName",auth)
  let roleAuth = role.includes(user.role)
  return (
    <div className={`${roleAuth ? "" : "hidden" } ${ auth && "hidden" }  bg-gray-800 w-auto fixed h-full max-h-max top-14  left-0  p-4 z-50 `}>
     <div className="flex relative top-15 h-full flex-col gap-2 items-center">
      <h1 className="font-bold mb-2 text-center">Admin Dashboard</h1>

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
      </div>
    </div>
  );
};

export default withAuth(AdminDashboardComponent);
