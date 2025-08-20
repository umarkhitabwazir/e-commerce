"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import OrdersIconComponent from "./OrdersIcon.component";
import adminAuth from "../utils/adminAuth";
import { UserInterface } from "../utils/user.interface";
import axios, { AxiosError } from "axios";
import { ProductInterface } from "../utils/productsInterface";
import SearchComponent from "./search.component";
import CategoryComponent from "./Category.component";
import useStickyScroll from "./UseStickyScroll.component";
import AdminNavbarComponent from "./AdminNavbar.component";
import { logOut } from "../utils/LogOut";
const Navbar = ({ user }: { user: UserInterface }) => {

    const [sortOption, setSortOption] = useState("");
    const [isProductSearched, setIsProductSearched] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchResult, setSearchResult] = useState<ProductInterface[] | null>(null);
    const searchParams = useSearchParams()
    const updatedSearchParams = new URLSearchParams(searchParams.toString());
    const searchResultParam = searchParams.get("search");
    const [searchInput, setSearchInput] = useState("");
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const admin = user?.role === 'admin'

    const [isLogedin, setIsLogedin] = useState<UserInterface | null>(null)
    const [categorisOpen, setCategorisOpen] = useState(false)
    const router = useRouter();
    const pathName = usePathname();
    const authRoutes = ["/sign-up", "/verify-email", "/reset-password", "/login", "/log-out"];
    const isAuthRoute = authRoutes.includes(pathName);


    useEffect(() => {

        if (searchResultParam) {
            setSearchInput(searchResultParam)
        }

    }, [searchResultParam, setSearchInput]);
    useEffect(() => {
        if (!searchResult) {
            setIsProductSearched(true)
        }
    }, [searchInput, setIsProductSearched])

    const search = async (value: string) => {


        try {
            setIsProductSearched(false)
            const res = await axios(`${API_URL}/search-products?search=${value}`);
            const data = res.data.data;
            const uniqueProducts = Array.from(new Set(data.map((product: ProductInterface) => product.title)))
                .map(title => {
                    return data.find((product: ProductInterface) => product.title === title);
                });
            setSearchResult(uniqueProducts);


        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 404) {
                    setSearchResult([]);

                }

            }


        }
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchInput(value)

        if (!value) {
            setSearchResult(null)
            updatedSearchParams.delete("search")
            router.push(`?${updatedSearchParams.toString()}`);
            return
        }

        search(value)
    };

    const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOption(e.target.value)

        router.push(`/?sort=${e.target.value}`);
    };

  
    const handleSitting =async (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value === 'log-out') {
            await logOut()
           return   router.push(`/login`)

        }
        router.push(`/${e.target.value}`);
    };

    const handleMenuToggle = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const isSticky = useStickyScroll();


    useEffect(() => {
        if (user) {
            setIsLogedin(user)
        }
    }, [user, isLogedin])


    return (
        <>
            {!isAuthRoute && (
                <nav
                    className={`${isSticky
                        ? "fixed top-0 bg-opacity-90  bg-gray-500 backdrop-blur-sm shadow-lg"
                        : "text-white relative bg-gray-900"
                        } flex flex-wrap   transition-all duration-400 w-screen z-50 py-3`}
                >
                    {!admin && (
                        <div className="container mx-auto  px-4">
                            <div className="flex  flex-wrap gap-2 items-center justify-between">
                                {/* Logo */}
                                <div
                                    className="text-2xl font-bold cursor-pointer tracking-tight hover:text-cyan-300 transition-colors"
                                    onClick={() => router.push("/")}
                                >
                                    Shop<span className="text-cyan-400">Hub</span>
                                </div>

                                <button
                                onClick={()=>router.push('/request-store')}
                                    className="inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-indigo-700 font-medium transition
                                  hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
                                   active:scale-[.98]"
                                >
                                    Become a Seller
                                </button>




                                {/* Desktop Navigation */}
                                <div className="hidden md:flex items-center space-x-6">
                                    {/* Search Bar */}
                                    <div className="relative w-64">
                                        <div className="flex rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                                            <input
                                                type="text"
                                                onChange={handleSearch}
                                                value={searchInput}
                                                placeholder="Search products..."
                                                className="w-full py-2 px-4 bg-transparent text-white placeholder-gray-300 focus:outline-none"
                                            />
                                            <button className="px-3 text-gray-300 hover:text-white">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                        <SearchComponent
                                            product={searchResult}
                                            isProductSearched={isProductSearched}
                                            setIsProductSearched={setIsProductSearched}
                                        />
                                    </div>

                                    {/* Sort Dropdown */}
                                    <div className="relative">
                                        <select
                                            value={sortOption}
                                            onChange={handleSort}
                                            className="py-2 pl-3 pr-8 rounded-lg bg-gray-800 border border-gray-700 text-white appearance-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent cursor-pointer"
                                        >
                                            <option value="" disabled>
                                                Sort By
                                            </option>
                                            <option value="priceLowHigh">Price: Low to High</option>
                                            <option value="priceHighLow">Price: High to Low</option>
                                            <option value="newest">Newest</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                            <svg
                                                className="h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Categories */}
                                    <div
                                        onMouseEnter={() => setCategorisOpen(true)}
                                        onMouseLeave={() => setCategorisOpen(false)}
                                        className="relative"
                                    >
                                        <button className="flex items-center space-x-1 text-gray-200 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-gray-800">
                                            <span>Categories</span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className={`h-4 w-4 transition-transform ${categorisOpen ? "rotate-180" : ""
                                                    }`}
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                        {categorisOpen && (
                                            <div className="absolute right-12  w-48 rounded-lg shadow-lg bg-gray-800 border border-gray-700 z-50">
                                                <CategoryComponent />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* User Actions */}
                                <div className="hidden md:flex items-center space-x-4">
                                    <div className="relative">
                                        <select
                                            id="userActions"
                                            name="userActions"
                                            value={sortOption}
                                            onChange={handleSitting}
                                            className="py-2 pl-3 pr-8 rounded-lg bg-gray-800 border border-gray-700 text-white appearance-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent cursor-pointer"
                                        >
                                            <option className="text-gray-400" value="" disabled hidden>
                                                {isLogedin ? isLogedin.email : "Account"}
                                            </option>
                                            <option className="py-2" value="sign-up">
                                                Sign Up
                                            </option>
                                            <option
                                                className={`${!user ? "hidden" : ""} py-2`}
                                                value="log-out"
                                            >
                                                Log Out
                                            </option>
                                            <option
                                                className={`${!user ? "hidden" : ""} py-2`}
                                                value="profile"
                                            >
                                                Profile
                                            </option>
                                            <option className="py-2" value="login">
                                                Login
                                            </option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                            <svg
                                                className="h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    </div>

                                    <OrdersIconComponent />
                                </div>

                                {/* Mobile Menu Button */}
                                <div className="md:hidden flex items-center">
                                    <button
                                        className="text-white focus:outline-none p-2 rounded-lg hover:bg-gray-800"
                                        onClick={handleMenuToggle}
                                    >
                                        {isMenuOpen ? (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4 6h16M4 12h16M4 18h16"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Mobile Navigation */}
                            {isMenuOpen && (
                                <div className="md:hidden py-4 space-y-4 border-t border-gray-700 mt-3">
                                    <div className="relative">
                                        <div className="flex rounded-lg bg-white/10">
                                            <input
                                                type="text"
                                                onChange={handleSearch}
                                                value={searchInput}
                                                placeholder="Search products..."
                                                className="w-full py-2 px-4 bg-transparent text-white placeholder-gray-300 focus:outline-none"
                                            />
                                            <button className="px-3 text-gray-300">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                        <SearchComponent
                                            product={searchResult}
                                            isProductSearched={isProductSearched}
                                            setIsProductSearched={setIsProductSearched}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="relative">
                                            <select
                                                value={sortOption}
                                                onChange={handleSort}
                                                className="w-full py-2 pl-3 pr-8 rounded-lg bg-gray-800 border border-gray-700 text-white appearance-none"
                                            >
                                                <option value="" disabled>
                                                    Sort By
                                                </option>
                                                <option value="priceLowHigh">Price: Low to High</option>
                                                <option value="priceHighLow">Price: High to Low</option>
                                                <option value="newest">Newest</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                                <svg
                                                    className="h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <button
                                                onClick={() => setCategorisOpen(!categorisOpen)}
                                                className="w-full flex justify-between items-center py-2 px-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
                                            >
                                                <span>Categories</span>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className={`h-4 w-4 transition-transform ${categorisOpen ? "rotate-180" : ""
                                                        }`}
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                            {categorisOpen && (
                                                <div className="absolute left-0 mt-2 w-full rounded-lg shadow-lg bg-gray-800 border border-gray-700 z-50">
                                                    <CategoryComponent />
                                                </div>
                                            )}
                                        </div>

                                        <div className=" flex justify-start flex-wrap-reverse col-span-2 space-x-20 ">
                                            <div className="relative ">
                                                <select
                                                    id="userActionsMobile"
                                                    name="userActions"
                                                    value={sortOption}
                                                    onChange={handleSitting}
                                                    className="w-full py-2 pl-3 pr-8 rounded-lg bg-gray-800 border border-gray-700 text-white appearance-none"
                                                >
                                                    <option className="text-gray-400" value="" disabled hidden>
                                                        {isLogedin ? isLogedin.email : "Account"}
                                                    </option>
                                                    <option value="sign-up">Sign Up</option>
                                                    <option className={`${!user ? "hidden" : ""}`} value="log-out">
                                                        Log Out
                                                    </option>
                                                    <option className={`${!user ? "hidden" : ""}`} value="profile">
                                                        Profile
                                                    </option>
                                                    <option value="login">Login</option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">

                                                    <svg
                                                        className="h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div>
                                                <OrdersIconComponent />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </nav>
            )}
            {admin && <AdminNavbarComponent />}
        </>
    );
};

export default adminAuth(Navbar);
