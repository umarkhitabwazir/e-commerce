'use client';

import React, {  useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import ResendVerificationCode from '../components/ResendVerificationCode.component';
import Link from 'next/link';
import Image from 'next/image';
// Define Zod schema for form validation
const VerifyEmailSchema = z.object({
  emailVerificationCode: z
    .string()
    .min(6, 'emailVerificationCode must be exactly 6 characters long')
    .max(6, 'emailVerificationCode must be exactly 6 characters long'),
});

// TypeScript type for the form fields
type VerifyEmailFormData = z.infer<typeof VerifyEmailSchema>;

const VerifyEmail = ({ email }: { email: string | null }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailFormData>({
    resolver: zodResolver(VerifyEmailSchema),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const searchParams = useSearchParams()
  const trackedPath = searchParams.get("track")

  const code = searchParams.get('code')
  const updatedSearchParams = new URLSearchParams(searchParams.toString())
  const router = useRouter()
  const API_URL = process.env.NEXT_PUBLIC_API_URL


  // verifyEmailFromEmaiBox
  useEffect(() => {
    const verifyEmailFormEmaiBox = async () => {
      try {
        const emailVerificationCode = { emailVerificationCode: code }
        await axios.post(`${API_URL}/verify-email`, emailVerificationCode, { withCredentials: true });
        setSuccess(true);
     
     router.push(`${trackedPath || "/"}?${updatedSearchParams} `);
        setTimeout(() => {
          window.location.reload()
        }, 700)
        

      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          setError(err.response?.data.error);
          // return router.push("/login")
        }

      } finally {
        setLoading(false);
      }
    }
    if (code) {
      verifyEmailFormEmaiBox()
    }
  }, [API_URL, code, router])

  const onSubmit = async (data: VerifyEmailFormData) => {
    setLoading(true);
    setError(null);
    try {
      const emailVerificationCode = { emailVerificationCode: data.emailVerificationCode }
      await axios.post(`${API_URL}/verify-email`, emailVerificationCode, { withCredentials: true });
      setSuccess(true);
     router.push(`${trackedPath || "/"}?${updatedSearchParams} `);
        setTimeout(() => {
          window.location.reload()
        }, 700)

    } catch (err: unknown) {
      if (err instanceof AxiosError) {

        setError(err.response?.data.error);
        if (err.response?.data.error === 'Unauthorized') {

          return router.push("/login")
        }
      }

    } finally {
      setLoading(false);

    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
  {!code && (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
        Verify Your Email
      </h2>
      <p className="text-sm text-gray-500 text-center mb-6">
        Enter the 6-digit code sent to your {email || "email"} to verify your account.
      </p>

      {success ? (
        <p className="text-green-600 text-center font-medium">
          Your email has been successfully verified!
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Verification Code
            </label>

            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                {...register("emailVerificationCode")}
                className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  errors.emailVerificationCode ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your code"
              />

              <button
                type="button"
                onClick={() => setPasswordVisible((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <Image
                  src={passwordVisible ? "/eye-solid.svg" : "/eye-slash-solid.svg"}
                  width={20}
                  height={20}
                  alt="toggle password visibility"
                />
              </button>
            </div>

            {errors.emailVerificationCode && (
              <p className="text-red-500 text-xs mt-1">
                {errors.emailVerificationCode.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 transition-colors"
            }`}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>
      )}

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}

      <div className="flex justify-center items-center pt-4">
        <ResendVerificationCode />
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/"
          className="text-sm font-medium text-gray-600 hover:text-gray-800 underline"
        >
          Home Page ↗
        </Link>
      </div>
    </div>
  )}
</div>

  );
};

export default VerifyEmail;
