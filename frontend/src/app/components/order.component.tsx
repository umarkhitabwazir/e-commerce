'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';


const OrderComponent = () => {
  const searchParams = useSearchParams();
  const LOCAL_HOST = process.env.NEXT_PUBLIC_LOCAL_HOST;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const getLoginedUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/get-logined-user`, { withCredentials: true });
        console.log("Logged-in User:", response.data);
      } catch (error) {
        console.error("Error fetching the logged-in user:", error);
      }
    };
    getLoginedUser()
    const value = searchParams.get('productId'); 
    console.log("value",value)
  }, [searchParams,API_URL]);

  return (
    <div className='bg-gray-400 min-h-screen p-20'>
      <h1 className='text-white text-center'>Order Page</h1>
    </div>
  );
};

export default OrderComponent;
