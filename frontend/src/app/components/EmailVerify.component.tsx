'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import ResendVerificationCode from '../components/ResendVerificationCode.component';
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
  const router = useRouter()
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const LOCAL_HOST = process.env.NEXT_PUBLIC_LOCAL_HOST
  const onSubmit = async (data: VerifyEmailFormData) => {
    setLoading(true);
    setError(null);
    try {
      const emailVerificationCode = { emailVerificationCode: data.emailVerificationCode }
      console.log("emailVerificationCode", emailVerificationCode)
      const response = await axios.post(`${API_URL}/verify-email`, emailVerificationCode, { withCredentials: true });
      console.log("response", response.data)
      setSuccess(true);
      router.push(`${LOCAL_HOST}/`)

    } catch (err:unknown) {
      console.log("err", err)
      if (err instanceof AxiosError) {
        
        return setError(err.response?.data.error);
      }

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-600 mb-4">Verify Your Email</h2>
        <p className="text-gray-500 text-center mb-6">
          Enter the 6-digit code sent to your {email} to verify your account.
        </p>
        {success ? (
          <p className="text-green-600 text-center font-semibold">
            Your email has been successfully verified!
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">Verification code</label>
              <input
                {...register('emailVerificationCode')}
                className={`w-full p-3 text-black border rounded-lg focus:outline-none ${errors.emailVerificationCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Enter your Code"
              />
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
      </div>
    </div>
  );
};

export default VerifyEmail;
