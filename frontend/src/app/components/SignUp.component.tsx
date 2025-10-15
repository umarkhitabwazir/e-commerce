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
    const [error, setError] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const router = useRouter()


    // Form submit handler
    const onSubmit = async (data: SignupFormData) => {

        setLoading(true); // Start loading
        setError(undefined); // Clear previous error
        try {

            await axios.post(`${API_URL}/user/signup`, data, { withCredentials: true });
          
          
          
                const maskEmail = (email: string) => {
                    const [name, domain] = email.split('@');
                    const firstTwo = name.slice(0, 2);
                    const lastTwo = name.slice(-2);

                    console.log(`${firstTwo}****${lastTwo}@${domain}`);

                    return `${firstTwo}****${lastTwo}@${domain}`
                };
                const maskedEmail = maskEmail(data.email)
                console.log('maskedEmail', maskedEmail)
           router.push(`/verify-email?email=${maskedEmail}`)

          

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


            <div className="flex flex-wrap w-screen max-w-xl h-auto justify-between items-center ">
                <div className="w-full  h-auto  bg-transparent p-8 ">
                        <Image
        src="/logo.jpg" 
        alt="App Logo" 
        width={100} 
        height={100} 
        className="mx-auto rounded-full mb-4"
    />
                    <h2 className="text-3xl font-bold text-orange-200 text-center mb-8">Sign Up</h2>
                    <form 
                    onSubmit={handleSubmit(onSubmit)} 
                    className=" flex flex-col  flex-wrap justify-center gap-2">
                        {/* Username Field */}
                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-orange-200 mb-1">Username</label>
                            <input
                                {...register('username')}
                                className={`w-full p-3 placeholder:text-orange-200 text-white bg-transparent border rounded-lg focus:outline-none ${errors.username ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter your username"
                            />
                            {errors.username && (
                                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                            )}
                        </div>

                      
                        {/* Email Field */}
                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-orange-200 mb-1">Email</label>
                            <input
                                {...register('email')}
                                type="email"
                                className={`w-full p-3 text-white placeholder:text-orange-200 bg-transparent border rounded-lg focus:outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter your email"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                      
                        {/* Password Field */}
                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-orange-200 mb-1">Password</label>
                            <div className='relative'>

                                <input
                                    {...register('password')}
                                    type={passwordVisible ? 'text' : 'password'}
                                    className={`w-full p-3 text-white placeholder:text-orange-200 bg-transparent border rounded-lg focus:outline-none ${errors.password ? 'border-red-500' : 'border-gray-300'
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
                        <div className='flex flex-col justify-center items-center gap-3'>

                 <Link
  href="/login"
  className="mt-3 inline-block px-6 py-2 rounded-lg bg-gray-800 text-white font-medium text-sm hover:bg-gray-900 transition-colors duration-200"
>
  Login
</Link>
  <Link
    href="/"
    className="text-sm font-medium text-gray-600 hover:text-white transition-colors duration-200"
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

export default SignupComponent;
