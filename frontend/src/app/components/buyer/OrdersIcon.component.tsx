"use client"
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios';
import buyerAuth from '@/app/auths/buyerAuth';

const OrderIconComponent = () => {
    const router = useRouter()
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const [orderCount, setOrderCount] = useState(0)
    const pathName = usePathname()
    const isOrderPage = pathName === "/buyer/orders"

    useEffect(() => {
        const order = async () => {
            try {
                const res = await axios.get(`${API_URL}/user-order`, { withCredentials: true })
               
                const orders = res.data.data.map((i: { isDelivered: boolean }) =>
                        i.isDelivered === false ? i : null
                    )
                    .filter(Boolean)
const fetchOrderAccepedCancel = orders.filter((order: { cancelled: boolean }) => !order.cancelled).length
                setOrderCount(fetchOrderAccepedCancel)
              
                
            } catch (error:unknown) {
                if (error instanceof AxiosError) {
                   return 
                }
            }
        }
        order()
    }, [API_URL])


    return (
   <div className="relative">
  <button
    title="Orders"
    onClick={() => router.push("/buyer/orders")}
    className="relative p-2 rounded-lg hover:bg-gray-800 transition-colors group focus:outline-none focus:ring-2 focus:ring-cyan-500"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-gray-200 group-hover:text-white transition-colors"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
      />
    </svg>
    
    {orderCount > 0 && !isOrderPage && (
      <span className="absolute -top-1 -right-1 bg-cyan-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md transform scale-100 group-hover:scale-110 transition-transform">
        {orderCount}
      </span>
    )}
  </button>
</div>
    )
}

export default buyerAuth( OrderIconComponent)
