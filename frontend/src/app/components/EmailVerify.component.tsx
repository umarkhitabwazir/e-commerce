'use client';

import React, { useEffect, useState } from 'react';
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
  const code = searchParams.get('code')
  const router = useRouter()
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const LOCAL_HOST = process.env.NEXT_PUBLIC_LOCAL_HOST

  // verifyEmailFromEmaiBox
  useEffect(() => {
    const verifyEmailFormEmaiBox = async () => {
      try {
        const emailVerificationCode = { emailVerificationCode: code }
        await axios.post(`${API_URL}/verify-email`, emailVerificationCode, { withCredentials: true });
        setSuccess(true);
        router.push(`/`)

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
  }, [API_URL, code, router, setLoading, setError])

  const onSubmit = async (data: VerifyEmailFormData) => {
    setLoading(true);
    setError(null);
    try {
      const emailVerificationCode = { emailVerificationCode: data.emailVerificationCode }
      await axios.post(`${API_URL}/verify-email`, emailVerificationCode, { withCredentials: true });
      setSuccess(true);
      router.push(`${LOCAL_HOST}/`)

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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {
        !code && <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center text-gray-600 mb-4">Verify Your Email</h2>
          <p className="text-gray-500 text-center mb-6">
            Enter the 6-digit code sent to your {email || 'email'} to verify your account.
          </p>
          {success ? (
            <p className="text-green-600 text-center font-semibold">
              Your email has been successfully verified!
            </p>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Verification code</label>

                <div className='relative'>

                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    {...register('emailVerificationCode')}
                    className={`w-full p-3 text-black border rounded-lg focus:outline-none ${errors.emailVerificationCode ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Enter your Code"
                  />

                  <div className='absolute right-3 top-3'>

                    <Image onClick={() => setPasswordVisible(prev => !prev)}
                      src={passwordVisible ? "/eye-solid.svg" : "/eye-slash-solid.svg"}
                      className='cursor-pointer'
                      width={20} height={20} alt='eye-slash-solid' />
                  </div>
                </div>
                {errors.emailVerificationCode && (
                  <p className="text-red-500 text-sm mt-1">{errors.emailVerificationCode.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg text-white ${loading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 transition duration-200'
                  }`}
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
            </form>
          )}
          {error && (
            <p className="text-red-500 text-center mt-4">{error}</p>
          )}
          <div className='flex justify-center items-center pt-4'>

            <ResendVerificationCode />

          </div>

          <div className='mt-3'>
            <Link
              className="w-full  hover:text-gray-500 text-gray-600 font-semibold underline py-2 px-4  rounded "
              href="/"
            >
              Return to Home Page↗
            </Link>
          </div>
        </div>


      }
    </div>
  );
};

export default VerifyEmail;
