'use client';
import React from 'react';

const Loading = () => {
 
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-80 flex justify-center items-center z-50">
      <div className="flex flex-col justify-center items-center">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-700 border-b-blue-500 rounded-full animate-spin"></div>
        <p className="text-black text-lg mt-4">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;