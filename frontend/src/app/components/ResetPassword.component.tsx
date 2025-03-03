"use client";
import axios, { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const ResetPasswordComponent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") as string;
    const [error, setError] = useState<string | undefined>(undefined);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const [loading, setLoading] = useState<boolean>(false);

    const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        setLoading(true);
        try {
             await axios.post(`${API_URL}/forgotPassword`, { email: form.email.value })
            
        router.push(`?email=${form.email.value}`);

        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.log('error', error?.response?.data.error)
                setError(error?.response?.data.error)
            }

        } finally {
            setLoading(false)
        }
    };

    const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const code = form.code.value;
        const newPassword = form.newPassword.value;

        if (code.length < 6) {
            setError("Code must be 6 digits")
            return
        }
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters")
            return
            
        }
        setLoading(true);
        const data = { email: email, passwordResetCode: code, newPassword: newPassword }
        try {
             await axios.post(`${API_URL}/resetPassword`, data)
             alert('Password reset successful')
            router.push('/login')

        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.log('resetPasswordError', error?.response?.data.error)
                setError(error?.response?.data.error)


            }
        }finally {
            setLoading(false)
        }


    };

    return (
        <>
            {
                !email ?
                    <div className="bg-gray-100 text-black flex w-auto justify-center items-center min-h-screen p-4">
                        <form
                            onSubmit={handleEmailSubmit}
                            className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-4 w-full max-w-md"
                        >
                            <label htmlFor="email" className="text-sm font-medium">
                                enter  Email to reset password
                            </label>
                            <input
                                name="email"
                                id="email"
                                type="email"
                                placeholder="Enter email"
                                required
                                className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
                            >
                                {loading ? 'loading...' : 'send code'}
                            </button>
                        </form>
                        {
                            error &&
                            <p className="text-red-600 font-light flex justify-center items-center mt-4">
                                {error}
                            </p>
                        }
                    </div>
                    :
                    <div className="bg-gray-100 text-black flex w-auto justify-center items-center min-h-screen p-4">
                        <form
                            onSubmit={handleResetPassword}
                            className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-4 w-full max-w-md"
                        >
                            <label htmlFor="code" className="text-sm font-medium">
                                Enter code sent to your email
                            </label>
                            <input
                                name="code"
                                id="code"
                                type="number"
                                placeholder="Enter code"
                                required
                                className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <label htmlFor="newPassword" className="text-sm font-medium">
                                Enter new password
                            </label>
                            <input
                                name="newPassword"
                                id="newPassword"
                                type="password"
                                placeholder="Enter new password"
                                required
                                className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
                            >
                               {loading ? 'loading...' : 'reset password'}
                            </button>
                            {
                                error &&
                                <p className="text-red-600 font-light flex justify-center items-center mt-4">
                                    {error}
                                </p>
                            }
                        </form>
                    </div>
            }
        </>
    );
};

export default ResetPasswordComponent;
