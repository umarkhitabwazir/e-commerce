"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import OrdersIconComponent from "./OrdersIcon.component";
import adminAuth from "../utils/adminAuth";
import { UserInterface } from "../utils/user.interface";
import axios, { AxiosError } from "axios";
import { ProductTypes } from "../utils/productsTypes";
import SearchComponent from "./search.component";
import CategoryComponent from "./Category.component";
import Image from "next/image";

const Navbar = ({ user }: { user: UserInterface }) => {
    const [sortOption, setSortOption] = useState("");
    const [isProductSearched, setIsProductSearched] = useState(false);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchResult, setSearchResult] = useState<ProductTypes[] | null>(null);
    const searchParams = useSearchParams()
    const updatedSearchParams = new URLSearchParams(searchParams.toString());
    const searchResultParam = searchParams.get("search");
    const [searchInput, setSearchInput] = useState("");
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const LOCAL_HOST = process.env.NEXT_PUBLIC_LOCAL_HOST;
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
            const uniqueProducts = Array.from(new Set(data.map((product: ProductTypes) => product.title)))
                .map(title => {
                    return data.find((product: ProductTypes) => product.title === title);
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
        updatedSearchParams.set("sort", e.target.value);
        router.push(`${LOCAL_HOST}/?${updatedSearchParams.toString()}`);
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
            if (scrollTop > 50) {
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


    useEffect(() => {
        if (user) {

            setIsLogedin(user)
        }

    }, [user, isLogedin])


    return (
        <>
            <nav
                className={`${isAuthRoute ? "hidden" : isFixed ? "fixed" : "sticky"} bg-gray-800 text-white transition-all duration-1000 top-0 w-full z-50 shadow-md`}
            >
                <div className="container mx-auto  lg:flex items-center justify-between  p-4">
                    {/* Logo */}

                    <div
                        className="text-2xl font-bold cursor-pointer hover:text-gray-300"
                        onClick={() => router.push("/")}
                    >
                        Shop
                    </div>

                    {/* Categories */}
                    <div
                        onMouseEnter={() => setCategorisOpen(true)}
                        onMouseLeave={() => setCategorisOpen(false)}
                        className="relative " >

                        <div className="flex hover:cursor-pointer justify-center  items-center text-sky">
                            <h1>Categories</h1>
                            <Image className={categorisOpen?'':'hidden'} src="/arrow-up.png" width={20} height={20} alt="arrow-up" />
                            <Image className={categorisOpen?'hidden':''} src="/arrow-down.png"  width={20} height={20} alt="arrow-down" />
                        </div>
                        <div className="absolute rounded-lg shadow-md ">

                            {categorisOpen && <CategoryComponent />}
                        </div>
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
                                value={searchInput}
                                placeholder="Search products..."
                                className="w-full p-2 rounded-lg text-gray-900"
                            />
                            <button
                                className="absolute right-2 top-2 text-gray-600 cursor-default"
                            >
                                🔍
                            </button>
                            <SearchComponent product={searchResult} isProductSearched={isProductSearched} setIsProductSearched={setIsProductSearched} />

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
                                    {isLogedin ? isLogedin.email : "register or login"}
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
                        <OrdersIconComponent />

                    </div>
                </div>
            </nav>
        </>
    );
};

export default adminAuth(Navbar);
