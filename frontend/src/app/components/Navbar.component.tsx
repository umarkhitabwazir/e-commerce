"use client"
import React, { useState } from 'react';
import axios from 'axios';
import Products from './Products.component';
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation';
const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState('');
  const LOCAL_HOST = process.env.NEXT_PUBLIC_LOCAL_HOST;
  
  let router = useRouter()
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    };
    
    const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
        
        router.push(`${LOCAL_HOST}?sort=${e.target.value}`);
        
    };
    let handleSignup=()=>{
        router.push(`${LOCAL_HOST}/sign-up`)
    }
    
    let pathName=usePathname()
    let routes = ["/sign-up", "/verify-email","/login"];
let isSignUp = routes.includes(pathName);
 
    return (
        <nav className={`${isSignUp? "hidden" : ""} bg-gray-800  text-white fixed top-0 w-full z-50 shadow-md`}>
            <div className="container mx-auto flex items-center justify-between p-4">
                {/* Logo */}
                <div className="text-2xl font-bold">Shop</div>

                {/* Search Bar */}
                <div className="relative w-1/3 hidden sm:block">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="Search products..."
                        className="w-full p-2 rounded-lg text-gray-900"
                    />
                    <button
                        onClick={() => console.log('Search submitted')} // Replace with actual functionality
                        className="absolute right-2 top-2 text-gray-600 hover:text-gray-900"
                    >
                        🔍
                    </button>
                </div>

                {/* Sort Dropdown */}
                <div className="hidden sm:block">
                    <select
                        value={sortOption}
                        onChange={handleSort}
                        className="p-2 rounded-lg bg-gray-700 cursor-pointer text-white"
                    >
                        <option value="" disabled>
                            Sort By
                        </option>
                        <option value="priceLowHigh">
                            Price: Low to High

                        </option>
                        <option value="priceHighLow">Price: High to Low</option>
                        <option value="rating">Rating</option>
                        <option value="newest">Newest</option>
                    </select>
                </div>

                {/* Sign Up Button */}
                <button 
                onClick={handleSignup}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold">
                    Sign Up
                </button>
            </div>

            {/* Mobile Search Bar */}
            <div className="sm:hidden px-4 py-2">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search products..."
                    className="w-full p-2 rounded-lg text-gray-900"
                />
            </div>
        </nav>
    );
};

export default Navbar;
