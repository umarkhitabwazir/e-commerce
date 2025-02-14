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


const LoginComponent = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(LoginSchema),
    });

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const LOCAL_HOST = process.env.NEXT_PUBLIC_LOCAL_HOST;
    const [error, setError] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false); // Track loading state
    const router = useRouter()
    const searchParams = useSearchParams()
    const trackedPath = searchParams.get("track")
    const quantity = searchParams.get('q')
    const product = searchParams.get('product')
    const productPrice = searchParams.get('p')
    const isQuantity = quantity ? quantity : ""
    const isProduct = product ? product : ""
    const isProductPrice = productPrice ? productPrice : ""
    const [networkError, setNetworkError] = useState(false)
    // Form submit handler
    const onSubmit = async (data: LoginFormData) => {

        setLoading(true); // Start loading
        setError(undefined); // Clear previous error
        try {

            const response = await axios.post(`${API_URL}/user/Login`, data, { withCredentials: true });
            const resdata = response

            // if email not verified
            if (resdata.data.statusCode === 401) {

                const maskEmail = (email: string) => {
                    const [name, domain] = email.split('@');
                    const firstTwo = name.slice(0, 2);
                    const lastTwo = name.slice(-2);


                    return `${firstTwo}****${lastTwo}@${domain}`
                };
                const maskedEmail = maskEmail(data.email)
                router.push(`${LOCAL_HOST}/verify-email?email=${maskedEmail}`)
            }




            setLoading(false); // Stop loading
            if (resdata.data.statusCode === 200) {

                router.push(`${trackedPath || "/"}?q=${isQuantity}&product=${isProduct}&p=${isProductPrice} `);

            }

        } catch (err: unknown) {

            setLoading(false); // Stop loading
            console.log('err', err)
            if (err instanceof AxiosError) {

                if (err.status === 500) {
                    setNetworkError(true)
                }
                if (err.response) {
                    setError(err.response.data.error); 
                } else {
                    setError('An unknown error occurred.');
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

            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-bold text-gray-600 text-center mb-8">Login</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">

                        {/* Email Field */}
                        <div className=" ">
                            <label className="block text-sm font-medium text-black mb-1">Email</label>
                            <input
                                {...register('email')}
                                type="email"
                                className={`w-full p-3 text-black border rounded-lg focus:outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter your email"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="">
                            <label className="block text-sm font-medium text-black mb-1">Password</label>
                            <input
                                {...register('password')}
                                type="password"
                                className={`w-full p-3 text-black border rounded-lg focus:outline-none ${errors.password ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter your password"
                            />
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
                            {error && (
                                <p className="text-red-600 font-light flex justify-center items-center mt-4">
                                    {error.split(' at ')[0]}
                                </p>
                            )}
                        </div>
                    </form>
                    <div className='flex items-center justify-center flex-col'>

                        <h4 className="text-center text-gray-500 text-sm">
                            or
                        </h4>
                        <Link
                            href="/sign-up"
                            className="text-blue-500 hover:text-blue-700 underline text-sm font-thin"
                        >
                            Sign up
                        </Link>

                    </div>
                    <Link
                            className="w-full  hover:text-gray-500 text-gray-600 font-semibold underline py-2 px-4 rounded mt-3"
                            href="/"
                        >
                            Return to Home Page↗
                        </Link>
                </div>
            </div>

        </>
    );
};

export default LoginComponent;
