"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import OrdersIconComponent from "../buyer/OrdersIcon.component";
import axios, { AxiosError } from "axios";
import { ProductInterface } from "../../utils/productsInterface";
import SearchComponent from "../buyer/search.component";
import CategoryComponent from "../buyer/Category.component";
import useStickyScroll from "../UseStickyScroll.component";
import { logOut } from "../../utils/LogOut";
import buyerAuth from "@/app/auths/buyerAuth";
import Image from "next/image";
import Link from "next/link";
import useAuth from "@/app/auths/auth";
const BuyerNavbarComponent = () => {
    const { user } = useAuth()
    const [sortOption, setSortOption] = useState("");
    const [isProductSearched, setIsProductSearched] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userActionOpen, setUserActionOpen] = useState(false);
    const [openSortAction, setOpenSortAction] = useState(false)
    const [searchResult, setSearchResult] = useState<ProductInterface[] | null>(null);
    const searchParams = useSearchParams()
    const updatedSearchParams = new URLSearchParams(searchParams.toString());
    const searchResultParam = searchParams.get("search");
    const [searchInput, setSearchInput] = useState("");
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const [categorisOpen, setCategorisOpen] = useState(false)
    const router = useRouter();
    const pathName = usePathname();
    const publicRoutes = ["/privacy-policy", "/request-store", "/ownership-statement", "/terms-and-conditions", "/refund-return-policy", "/shipping-policy", "/", "/contact"].includes(pathName);
    const userRoles = process.env.NEXT_PUBLIC_ROLES?.split(',')
    const authRoutes = ["/sign-up", "/verify-email", "/reset-password", "/login"];
    const isAuthRoute = authRoutes.includes(pathName);

    const roleAuth = ["/buyer"].some(route => pathName.startsWith(route));
    const sellerRoleAuth = ["/seller"].some(route => pathName.startsWith(route));
    const adminRoleAuth = ["/admin"].some(route => pathName.startsWith(route));




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
        setTimeout(() => {
            if (value) {
                search(value)
            }
        }, 600);
    };

    const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOption(e.target.value)
        setCategorisOpen((prev) => !prev)
        router.push(`/?sort=${e.target.value}`);
    };


    const handleSitting = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value === 'log-out') {
            await logOut()
            return router.push(`/login`)

        }
        if (user?.role === userRoles?.[2] && !["sign-up", "login"].includes(e.target.value)) return router.push(`/seller/${e.target.value}`);
        if (e.target.value === 'sign-up') return router.push(`/sign-up`);
        if (e.target.value === 'login') return router.push(`/login`);
        if (e.target.value === 'profile') return router.push(`/buyer/${e.target.value}`);
        if (e.target.value === 'contact') return router.push(`/${e.target.value}`);
    };

    const handleMenuToggle = () => {
        setIsMenuOpen((prev) => !prev)
    };

    const isSticky = useStickyScroll();



    return (
        <>

            {(publicRoutes || (!isAuthRoute && roleAuth)) && (
                <nav
                    className={`${isSticky
                        ? "fixed top-0 bg-gray-800 bg-opacity-70 backdrop-blur-lg shadow-lg"
                        : "relative bg-gray-800"} select-none text-white transition-all duration-300 w-full z-50 p-2`}

                >
                    {(
                        <div className="container mx-auto   px-4">
                            <div className="flex flex-wrap justify-between items-center  ">
                                {/* Logo */}
                                <div
                                    className="   flex flex-col w-20  justify-center items-center cursor-pointer tracking-tight hover:text-cyan-300 transition-colors"
                                    onClick={() => {

                                        router.push("/")
                                        setSearchResult(null)
                                        setSearchInput("")
                                        setIsProductSearched(false)
                                    }
                                    }
                                >
                                    <Image
                                        src="/logo.jpg"
                                        alt="Logo"
                                        width={70}
                                        height={70}
                                        className="w-[70px] h-[70px] object-center rounded-full border border-cyan-500 hover:border-cyan-300 "
                                    />

                                    <div className="overflow-hidden whitespace-nowrap">
                                        <div className="inline-block animate-marquee text-[15px] font-semibold tracking-wide">
                                            SAADI<span className="">collection</span>
                                            <span className="text-[10px] ml-0.5 text-cyan-300 ">.shop</span>
                                        </div>
                                    </div>



                                </div>
                                {/* Desktop Navigation */}
                                <div className="hidden md:flex items-center flex-wrap justify-between space-x-2 space-y-2 md:space-y-0">
                                   <button
                                        onClick={() => router.push('/request-store')}
                                        className="text-sm font-medium hover:text-blue-400"
                                    >
                                        Sell Now
                                    </button>


                                    {
                                        !sellerRoleAuth && user?.role === userRoles?.[2] &&
                                        <Link href="/seller"
                                            className="font-medium hover:text-gray-300 cursor-pointer"

                                        >
                                            Dashboard
                                        </Link>

                                    }
                                    {
                                        !adminRoleAuth && user?.role === userRoles?.[0] &&
                                        <Link href="/admin"
                                            className="font-medium hover:text-gray-300 cursor-pointer"

                                        >
                                            Dashboard
                                        </Link>

                                    }
                                    {/* Search Bar */}
                                    <div className="relative w-64">
                                        <div className="flex rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 focus-within:border-cyan-400 transition-colors duration-200">
                                            <input
                                                type="text"
                                                onChange={handleSearch}
                                                value={searchInput}
                                                placeholder="Search products..."
                                                className="w-full py-2 px-4 bg-transparent text-white placeholder-gray-300 focus:outline-none"
                                            />
                                        </div>

                                        {searchInput !== '' && <SearchComponent
                                            product={searchResult}
                                            isProductSearched={isProductSearched}
                                            setIsProductSearched={setIsProductSearched}
                                        />}
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
                                    {/* Sort Dropdown */}
                                    <div className="relative">
                                        <button
                                            className="flex  items-center justify-center absolute right-2 top-3 text-gray-200 hover:text-white rounded-lg"

                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className={`h-4 w-4 transition-transform ${openSortAction ? "rotate-180" : "rotate-0"}`}
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
                                        <select
                                            value={sortOption}
                                            onChange={handleSort}
                                            onClick={() => setOpenSortAction((prev) => !prev)}
                                            className="py-2 pl-3  pr-8 rounded-lg bg-gray-800 border border-gray-700 hover:border-cyan-400 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent cursor-pointer transition-all duration-200 appearance-none"

                                        >
                                            <option value="sort" disabled>
                                                Sort By
                                            </option>
                                            <option value="priceLowHigh">Price: Low to High</option>
                                            <option value="priceHighLow">Price: High to Low</option>
                                            <option value="newest">Newest</option>
                                        </select>

                                    </div>

                                    <div className="hidden md:flex items-center space-x-4">
                                        <Link
                                            href='/contact'
                                            className="font-medium hover:text-gray-300 cursor-pointer"
                                        >
                                            Contact Us
                                        </Link>
                                        {/* User Actions */}
                                        <div className="relative">
                                            <button
                                                className="flex items-center justify-center absolute right-2 top-3 text-gray-200 hover:text-white rounded-lg"

                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className={`h-4 w-4 transition-transform ${userActionOpen ? "rotate-180" : "rotate-0"}`}
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

                                            <select
                                                id="userActions"
                                                name="userActions"
                                                value={user?.email?.split('@')[0]}
                                                onChange={handleSitting}
                                                onClick={() => setUserActionOpen((prev) => !prev)}
                                                className="py-2 pl-3 pr-8 rounded-lg bg-gray-800 border border-gray-700 hover:border-cyan-400 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent cursor-pointer transition-all duration-200 appearance-none"
                                            >
                                                <option
                                                    className="text-gray-400"
                                                    value={user?.email?.split('@')[0]}
                                                    disabled
                                                    hidden
                                                >
                                                    {user ? user.email?.split('@')[0] : "Account"}
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
                                        </div>



                                        <OrdersIconComponent />
                                    </div>
                                </div>


                                {/* Mobile Menu Button */}


                                <div className="md:hidden relative flex flex-wrap justify-evenly items-center space-y-2 ">

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
                                <div className="md:hidden relative flex flex-col gap-4   mt-4 p-3  rounded-lg shadow-lg">
                                    {
                                        !sellerRoleAuth && user?.role === userRoles?.[2] &&
                                        <Link href="/seller"
                                            className="font-medium hover:text-gray-300 cursor-pointer"

                                        >
                                            Dashboard
                                        </Link>

                                    }
                                    {
                                        !adminRoleAuth && user?.role === userRoles?.[0] &&
                                        <Link href="/admin"
                                            className="font-medium hover:text-gray-300 cursor-pointer"

                                        >
                                            Dashboard
                                        </Link>

                                    }
                                    {/* Sort Dropdown */}
                                    <div className="relative">
                                        <button

                                            className=" border-gray-700  absolute right-4 top-3 text-gray-200 hover:text-white rounded-lg"

                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className={`h-4 w-4 transition-transform ${openSortAction ? "rotate-180" : "rotate-0"}`}
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
                                        <select
                                            value={sortOption}
                                            onChange={handleSort}
                                            onClick={() => {
                                                setOpenSortAction((prev) => !prev)
                                                setCategorisOpen(false)
                                            }}
                                            className="py-2 pl-3 w-full  pr-10 rounded-lg bg-gray-800 border  border-gray-700 hover:border-cyan-400 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent cursor-pointer transition-all duration-200 appearance-none"

                                        >
                                            <option value="sort" disabled>
                                                Sort By
                                            </option>
                                            <option value="priceLowHigh">Price: Low to High</option>
                                            <option value="priceHighLow">Price: High to Low</option>
                                            <option value="newest">Newest</option>
                                        </select>

                                    </div>

                                    {/* Categories Dropdown */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setCategorisOpen(!categorisOpen)}
                                            className="w-full flex justify-between items-center py-2 px-3 rounded-md bg-gray-800 border border-gray-700 text-sm text-white focus:ring-2 focus:ring-blue-500"
                                        >
                                            <span>Categories</span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className={`h-4 w-4 transform transition-transform ${categorisOpen ? "rotate-180" : ""}`}
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path fillRule="evenodd" d="M5.3 7.3a1 1 0 011.4 0L10 10.6l3.3-3.3a1 1 0 111.4 1.4l-4 4a1 1 0 01-1.4 0l-4-4a1 1 0 010-1.4z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        {categorisOpen && (
                                            <div className="absolute left-0 mt-2 w-full z-50 rounded-md shadow-md bg-gray-800 border border-gray-700">
                                                <CategoryComponent />
                                            </div>
                                        )}
                                    </div>

                                    {/* User Actions */}
                                    <div className="relative">
                                        <button
                                            className="flex items-center justify-center absolute right-2 top-3 text-gray-200 hover:text-white rounded-lg"

                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className={`h-4 w-4 transition-transform ${userActionOpen ? "rotate-180" : "rotate-0"}`}
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

                                        <select
                                            id="userActions"
                                            name="userActions"
                                            value={user?.email?.split('@')[0]}
                                            onChange={handleSitting}
                                            onClick={() => setUserActionOpen((prev) => !prev)}
                                            className="py-2 pl-3 pr-8 rounded-lg w-full bg-gray-800 border border-gray-700 text-white hover:border-cyan-400  focus:ring-2 focus:ring-cyan-500 focus:border-transparent cursor-pointer transition-all duration-200 appearance-none"
                                        >
                                            <option
                                                className="text-gray-400"
                                                value={user?.email?.split('@')[0]}
                                                disabled
                                                hidden
                                            >
                                                {user ? user.email?.split('@')[0] : "Account"}
                                            </option>
                                            <option value="sign-up">Sign Up</option>
                                            <option className={`${!user ? "hidden" : " bg-red-500"}`} value="log-out">
                                                Log Out
                                            </option>
                                            <option className={`${!user ? "hidden" : ""}`} value="profile">
                                                Profile
                                            </option>
                                            <option value="login">Login</option>
                                            <option value="contact">Contact Us</option>
                                        </select>
                                    </div>

                                    {/* Search Section */}
                                    <div className="relative">
                                        <div className="flex items-center rounded-md bg-gray-800 border border-gray-700 focus-within:ring-2 focus-within:ring-blue-500">
                                            <input
                                                type="text"
                                                onChange={handleSearch}
                                                value={searchInput}
                                                placeholder="Search products..."
                                                className="w-full py-2 px-4 bg-transparent text-sm text-white placeholder-gray-400 focus:outline-none"
                                            />
                                        </div>
                                        <SearchComponent
                                            product={searchResult}
                                            isProductSearched={isProductSearched}
                                            setIsProductSearched={setIsProductSearched}
                                        />
                                    </div>
                                </div>

                            )}
                        </div>
                    )}
                </nav>
            )

            }

        </>
    );
};



export default buyerAuth(BuyerNavbarComponent)