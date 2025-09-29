"use client";
import { useRouter } from 'next/navigation';
import React from 'react';


type ErrorScreenProps = {
  message: string;
};

export default function ErrorScreen({ message }: ErrorScreenProps) {
    const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen  px-4">
      <h1 className="text-6xl font-bold text-red-600 mb-4">Error</h1>
      <p className="text-lg text-gray-700 mb-6 text-center max-w-md">
        {message}
      </p>
      <button
      onClick={() => {
        router.push('/');
        setTimeout(() => {

        window.location.reload();
        }, 100);
      }}
     
        className="px-6 py-3 hover:cursor-pointer bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        Back to Home
      </button>
    </div>
  );
}
