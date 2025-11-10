'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { LoginSchema, LoginFormData } from '../utils/formSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import NoInternetComponent from './NoInternet.component';
import Image from 'next/image';


const LoginComponent = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(LoginSchema),
    });

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const [error, setError] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false); // Track loading state
    const router = useRouter()
    const searchParams = useSearchParams()
    const updatedSearchParams = new URLSearchParams(searchParams.toString())
    const trackedPath = searchParams.get("track")
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [networkError, setNetworkError] = useState(false)
    // Form submit handler
    const onSubmit = async (data: LoginFormData) => {

        setLoading(true); // Start loading
        setError(undefined); // Clear previous error
        try {

            const response = await axios.post(`${API_URL}/user/Login`, data, { withCredentials: true });
            const resdata = response?.data.data
            if (resdata === "notVerified") {

                const maskEmail = (email: string) => {
                    const [name, domain] = email.split('@');
                    const firstTwo = name.slice(0, 2);
                    const lastTwo = name.slice(-2);


                    return `${firstTwo}****${lastTwo}@${domain}`
                };
                const maskedEmail = maskEmail(data.email)
                router.push(`/verify-email?email=${maskedEmail}`)
            }




            const userRole = response.data.data.role;
            setLoading(false); // Stop loading
            if (response.data.data.isVerified) {
                if (userRole === "buyer") {
                    router.push(`${trackedPath || "/buyer"}?${updatedSearchParams} `);
                }
                if (userRole === "super-admin") {
                    router.push("/admin");
                }
                if (userRole === "seller") {
                    router.push("/seller");
                }

            }

        } catch (err: unknown) {
            setLoading(false); // Stop loading
            if (err instanceof AxiosError) {
                const message =
                    err.response?.data?.error ||
                    "Something went wrong. Please try again later.";
                if (err.status === 500) {
                    setNetworkError(true)
                }

                // if email not verified

                if (err.response) {
                    setError(message)

                    setTimeout(() => {

                        setError(undefined)
                    }, 3000)

                } else {
                    setError('An unknown error occurred.');
                    setTimeout(() => {
                        setError(undefined)
                    }, 3000)
                }
                if (err.code === "ERR_NETWORK") {
                    setLoading(true)
                }

            }
        }

    };
    return (
        <>
            {
                networkError && <NoInternetComponent />
            }

            <div className="flex justify-center items-center min-h-screen  bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-4">
                <div className="w-full max-w-4xl bg-transparent p-8 rounded-lg shadow-lg">
                    <div className="text-center mb-10">
                        <Image
                            src="/logo.jpg"
                            alt="App Logo"
                            width={100}
                            height={100}
                            className="mx-auto rounded-full mb-4"
                        />
                        <h1 className="text-4xl font-extrabold text-orange-200">Welcome Back</h1>
                        <p className="text-gray-300 mt-2">Log in to manage your account and explore new features</p>
                    </div>
                    {error && (
                        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 max-w-sm w-[90%] bg-red-500 text-white text-sm px-4 py-2 rounded shadow-md z-50 text-center break-words">
                            {error.split(' at ')[0]}
                        </div>
                    )}

                    <h2 className="text-3xl font-bold text-white text-center mb-8">Login</h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">

                        {/* Email Field */}
                        <div className=" ">
                            <label className="block text-sm font-medium text-orange-200 mb-1">Email</label>
                            <input

                                {...register('email')}
                                type="email"
                                className={`w-full p-3 placeholder:text-orange-200 text-white bg-transparent border rounded-lg focus:outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter your email"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="">
                            <label className="block text-sm font-medium text-orange-200 mb-1">Password</label>
                            <div className='relative'>

                                <input
                                    {...register('password')}
                                    type={passwordVisible ? 'text' : 'password'}
                                    className={`w-full p-3 placeholder:text-orange-200  border text-white bg-transparent rounded-lg focus:outline-none ${errors.password ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter your password"
                                />

                                <div className='absolute right-3 top-3'>

                                    <Image onClick={() => setPasswordVisible(prev => !prev)}
                                        src={passwordVisible ? "/eye-solid.svg" : "/eye-slash-solid.svg"}
                                        className='cursor-pointer'
                                        width={20} height={20} alt='eye-slash-solid' />
                                </div>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>



                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                className={`w-full py-3 rounded-lg transition duration-200 ${loading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                disabled={loading}
                            >
                                {loading ? 'Submitting...' : 'Login'}
                            </button>

                        </div>
                    </form>
                    <div className='flex items-center justify-center flex-col'>

                        <h4 className="text-center text-gray-500 text-sm">
                            or
                        </h4>

                        <div className="flex items-center justify-center flex-col mt-6 space-y-4">
                            <Link
                                href="/sign-up"
                                className="w-full text-center py-2 px-4 rounded-lg bg-gray-800 text-white font-medium hover:bg-gray-900 transition-colors duration-200"
                            >
                                Sign Up
                            </Link>
                        </div>

                        <div className="flex flex-wrap justify-between items-center mt-6 gap-3">
                            <Link
                                href="/reset-password"
                                className="text-sm font-medium text-blue-400 hover:text-blue-500 transition-colors duration-200"
                            >
                                Forgot Password?
                            </Link>

                            <Link
                                href="/"
                                className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
                            >
                                Home Page ↗
                            </Link>
                        </div>

                    </div>

                </div>
            </div>

        </>
    );
};

export default LoginComponent;
