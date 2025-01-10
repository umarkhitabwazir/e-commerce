'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// Define Zod schema for form validation
const LoginSchema = z.object({

    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),

});

// TypeScript type for the form fields
type LoginFormData = z.infer<typeof LoginSchema>;

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

    // Form submit handler
    const onSubmit = async (data: LoginFormData) => {

        setLoading(true); // Start loading
        setError(undefined); // Clear previous error
        try {

            const response = await axios.post(`${API_URL}/user/Login`, data, { withCredentials: true });
            const created = response.data
            console.log("created", created)
            if (created) {
                const maskEmail = (email: string) => {
                    const [name, domain] = email.split('@');
                    let firstTwo = name.slice(0, 2);
                    let lastTwo = name.slice(-2);

                    console.log(`${firstTwo}****${lastTwo}@${domain}`);

                    return `${firstTwo}****${lastTwo}@${domain}`
                };
                let maskedEmail = maskEmail(data.email)
                router.push(`${LOCAL_HOST}/verify-email?email=${maskedEmail}`)

            }
            let resdata = response
            console.log(resdata)
            setLoading(false); // Stop loading

        } catch (err: any) {

            setLoading(false); // Stop loading

            if (err.response) {
                setError(err.response.data.error); // Set error message from backend
            } else {
                setError('An unknown error occurred.');
            }
            // if email not verified
            if (err.status === 401) {
                router.push(`${LOCAL_HOST}/verify-email`)
            }
        }
    };

    return (
        <>


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
                </div>
            </div>

        </>
    );
};

export default LoginComponent;
