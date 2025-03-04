'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { SignupSchema, SignupFormData } from '../utils/formSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// Define Zod schema for form validation


const SignupComponent = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormData>({
        resolver: zodResolver(SignupSchema),
    });

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const LOCAL_HOST = process.env.NEXT_PUBLIC_LOCAL_HOST;
    const [error, setError] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const router = useRouter()


    // Form submit handler
    const onSubmit = async (data: SignupFormData) => {

        setLoading(true); // Start loading
        setError(undefined); // Clear previous error
        try {

            const response = await axios.post(`${API_URL}/user/signup`, data, { withCredentials: true });
           console.log('response', response)
            const created = response.statusText === 'Created'
            if (created) {
                const maskEmail = (email: string) => {
                    const [name, domain] = email.split('@');
                    const firstTwo = name.slice(0, 2);
                    const lastTwo = name.slice(-2);

                    console.log(`${firstTwo}****${lastTwo}@${domain}`);

                    return `${firstTwo}****${lastTwo}@${domain}`
                };
                const maskedEmail = maskEmail(data.email)
                console.log('maskedEmail', maskedEmail)
               return router.push(`/verify-email?email=${maskedEmail}`)

            }

            setLoading(false); // Stop loading

        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                setLoading(false); // Stop loading

                if (err?.response) {
                    setError(err.response.data.error); // Set error message from backend
                } else {
                    setError('An unknown error occurred.');
                }
            }

        }
    };

    return (
        <>


            <div className="flex justify-center items-center p-20 min-h-screen bg-gray-100">
                <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-bold text-gray-600 text-center mb-8">Sign Up</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className=" flex  flex-wrap justify-center gap-2">
                        {/* Username Field */}
                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-black mb-1">Username</label>
                            <input
                                {...register('username')}
                                className={`w-full p-3 text-black border rounded-lg focus:outline-none ${errors.username ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter your username"
                            />
                            {errors.username && (
                                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                            )}
                        </div>

                        {/* Full Name Field */}
                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-black mb-1">Full Name</label>
                            <input
                                {...register('fullName')}
                                className={`w-full p-3 text-black border rounded-lg focus:outline-none ${errors.fullName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter your full name"
                            />
                            {errors.fullName && (
                                <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className="flex flex-col">
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
                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-black mb-1">Password</label>
                            <div className='relative'>

                                <input
                                    {...register('password')}
                                    type={passwordVisible ? 'text' : 'password'}
                                    className={`w-full p-3 text-black border rounded-lg focus:outline-none ${errors.password ? 'border-red-500' : 'border-gray-300'
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



                        {/* Phone Field */}
                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-black mb-1">Phone</label>
                            <input
                                {...register('phone')}
                                className={`w-full p-3 text-black border rounded-lg focus:outline-none ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter your phone number"
                            />
                            {errors.phone && (
                                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                     
                        <button
                            type="submit"
                            className={`w-full py-3 rounded-lg mt-4 transition duration-200 ${loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Sign Up'}
                        </button>
                        {error && (
                            <p className="text-red-600 font-light flex justify-center items-center mt-4">
                                {error.split(' at ')[0]}
                            </p>
                        )}
                    
                    </form>
                    <div className='flex items-center justify-center flex-col'>

                        <h4 className="text-center text-gray-500 text-sm">
                            or
                        </h4>
                        <Link
                            href="/login"
                            className="text-blue-500 hover:text-blue-700 underline text-lg font-extrabold"
                        >
                            Login
                        </Link>
                    </div>

                </div>
            </div>

        </>
    );
};

export default SignupComponent;
