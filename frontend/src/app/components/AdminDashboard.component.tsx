"use client"
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import adminAuth from "../utils/adminAuth";
import { UserInterface } from "../utils/user.interface";

const AdminDashboardComponent = ({ user }: { user: UserInterface | null }) => {
  const pathName = usePathname()
  
  const role = ["admin", "superadmin"]
  const route = ["/login", "/log-out", "/verify-email", "/sign-up"]
  const [showDasboard, setShowDasboard] = useState(false)
  const auth = route.includes(pathName)
  
  if (!user)  return null;

  const roleAuth = role.includes(user.role)
  return (
    roleAuth && !auth && <div className={` bg-gray-800 w-auto fixed h-full max-h-max top-14  left-0  p-4 z-50 `}>
      <div
        onMouseEnter={() => setShowDasboard(true)}
        onMouseLeave={() => setShowDasboard(false)}
        className=" ">
        <h1 className="font-bold mb-2 text-center">Admin Dashboard</h1>

      { showDasboard &&
       <div className="flex  h-full flex-col gap-2">
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
        </div>}

      </div>
    </div>
  );
};

export default adminAuth(AdminDashboardComponent);
