"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import OrdersIconComponent from "./OrdersIcon.component";
import adminAuth from "../utils/adminAuth";
type User={
    email:string
}
const Navbar = ({user}:{user:User}) => {
    const [sortOption, setSortOption] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Added for toggle menu
    const LOCAL_HOST = process.env.NEXT_PUBLIC_LOCAL_HOST;
    const [isLogedin,setIsLogedin]=useState<User | null>({email:""})
    const router = useRouter();
    const pathName = usePathname();
    const authRoutes = ["/sign-up", "/verify-email", "/login", "/log-out"];
    const isAuthRoute = authRoutes.includes(pathName);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e)
    };

    const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOption(e.target.value)
        router.push(`${LOCAL_HOST}?sort=${e.target.value}`);
    };

    const handleSitting = (e: React.ChangeEvent<HTMLSelectElement>) => {
        router.push(`${LOCAL_HOST}/${e.target.value}`);
    };

    const handleMenuToggle = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const [isFixed, setIsFixed] = useState(false);

    useEffect(() => {
      const handleScroll = () => {
        const scrollTop = window.scrollY;
        if (scrollTop > 50  ) {
          setIsFixed(true);
        } else {
          setIsFixed(false);
        }
      };
  
      window.addEventListener("scroll", handleScroll);
  
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, []);


    useEffect(()=>{
        if (user) {
            
            setIsLogedin(user)
        }

    },[user,isLogedin])


    return (
        <nav
            className={`${isAuthRoute ? "hidden" :isFixed?"fixed": "sticky"} bg-gray-800 text-white transition-all duration-1000 top-0 w-full z-50 shadow-md`}
        >
            <div className="container mx-auto  lg:flex items-center justify-between p-4">
                {/* Logo */}
                <div
                    className="text-2xl font-bold cursor-pointer"
                    onClick={() => router.push("/")}
                >
                    Shop
                </div>

                {/* Hamburger Menu for Mobile */}
                <div className="md:hidden ">
                    <button
                        className="text-white focus:outline-none"
                        onClick={handleMenuToggle}
                    >
                        {isMenuOpen ? "✖" : "☰"}
                    </button>
                </div>

                {/* Navbar Content */}
                <div
                    className={`${isMenuOpen ? "block" : "hidden"
                        } md:flex flex-col md:flex-row md:items-center md:w-auto w-full space-y-4 md:space-y-0 md:space-x-4`}
                >
                    {/* Search Bar */}
                    <div className="relative w-full md:w-1/3">
                        <input
                            type="text"
                            onChange={handleSearch}
                            placeholder="Search products..."
                            className="w-full p-2 rounded-lg text-gray-900"
                        />
                        <button
                            onClick={() => console.log("Search submitted")}
                            className="absolute right-2 top-2 text-gray-600 hover:text-gray-900"
                        >
                            🔍
                        </button>
                    </div>

                    {/* Sort Dropdown */}
                    <div>
                        <select
                            value={sortOption}
                            onChange={handleSort}
                            className="p-2 rounded-lg bg-gray-700 cursor-pointer text-white"
                        >
                            <option value="" disabled>
                                Sort By
                            </option>
                            <option value="priceLowHigh">Price: Low to High</option>
                            <option value="priceHighLow">Price: High to Low</option>
                            <option value="rating">Rating</option>
                            <option value="newest">Newest</option>
                        </select>
                    </div>

                    {/* User Actions Dropdown */}
                    <div className="w-48">
                        <select
                            id="userActions"
                            name="userActions"
                            value={sortOption}
                            onChange={handleSitting}
                            className="block w-full py-2 bg-gray-700 text-white font-semibold rounded-lg shadow-md focus:ring focus:ring-blue-300 focus:outline-none transition duration-200 cursor-pointer hover:bg-gray-600"
                        >

                            <option className={` hidden cursor-pointer text-gray-400`} value="">
                               {isLogedin?.email ?  isLogedin.email :  "register or login"} 
                            </option>
                            <option className="cursor-pointer" value="sign-up">
                                Sign Up
                            </option>
                            <option className={`${!user && "hidden"} cursor-pointer`} value="log-out">
                                Log Out
                            </option>
                            <option className={`${!user && "hidden"} cursor-pointer`} value="profile">
                                Profile
                            </option>
                            <option className="cursor-pointer" value="login">
                                Login
                            </option>
                        </select>
                    </div>

                    {/* Order Button */}
                    <OrdersIconComponent/>

                </div>
            </div>
        </nav>
    );
};

export default adminAuth( Navbar);
