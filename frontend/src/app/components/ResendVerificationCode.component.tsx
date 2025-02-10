"use client";
import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';

const ResendVerificationCode = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [loading, setLoading] = useState<boolean>(false); // Track loading state
  const [resMesg, setResMesg] = useState<string | null>("");
  const [error, setError] = useState<string | undefined>(undefined);

  const handleResendCode = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/resendVerificationCode`, {}, { withCredentials: true });
      setResMesg(response.data.message);
      setLoading(false);
      setTimeout(() => {
        setResMesg("");
      }, 2000);
    } catch (err: unknown) {
      setLoading(false);
      if (err instanceof AxiosError) {
        setError(err.response?.data.error || "An unknown error occurred.");
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <div>
      <button
        onClick={handleResendCode}
        className={`w-full py-3 rounded-lg transition p-3 duration-200 ${loading
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Resend Verification Code'}
      </button>

      {resMesg && (
        <p className="mt-4 text-green-600 font-medium transition duration-300">
          {resMesg}
        </p>
      )}

      {error && (
        <p className="mt-4 text-red-500 font-medium transition duration-300">
          {error}
        </p>
      )}
    </div>
  );
};

export default ResendVerificationCode;