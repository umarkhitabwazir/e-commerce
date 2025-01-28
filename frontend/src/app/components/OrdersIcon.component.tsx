"use client"
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import withAuth from '../utils/withAuth';
import axios from 'axios';

const OrderIconComponent = () => {
    const router = useRouter()
    const LOCAL_HOST = process.env.NEXT_PUBLIC_LOCAL_HOST;
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const [orderCount, setOrderCount] = useState(0)
    const pathName = usePathname()
    const isOrderPage = pathName === "/your-orders"

    useEffect(() => {
        let order = async () => {
            try {
                let res = await axios.get(`${API_URL}/user-order`, { withCredentials: true })
                let orders = res.data.data
                    .map((i: { isDelivered: boolean }) =>
                        i.isDelivered === false ? i : null
                    )
                    .filter(Boolean)
let fetchOrderAccepedCancel = orders.filter((order: { cancelled: boolean }) => !order.cancelled).length
                setOrderCount(fetchOrderAccepedCancel)
                console.log(
                    "res",
                    res.data.data


                );
                
            } catch (error) {
                console.log("error", error)
            }
        }
        order()
    }, [API_URL])


    return (
        <div>
            <div title='Orders' onClick={() => { router.push(`${LOCAL_HOST}/your-orders`) }} className="relative cursor-pointer">
                <div className={`${isOrderPage ? "hidden" :orderCount===0?"hidden": ""}  bg-gray-600 rounded-full flex justify-center items-center w-6 h-6 absolute left-5 md:right-0 bottom-7 shadow-md`}>
                    <h2 className="text-white text-sm font-bold">{orderCount}</h2>
                </div>
                <img
                    className="rounded-md"
                    src="/order.png"
                    width={40}
                    height={40}
                    alt="Order Icon"
                />
            </div>
        </div>
    )
}

export default withAuth(OrderIconComponent)
