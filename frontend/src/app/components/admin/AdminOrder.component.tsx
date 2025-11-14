"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { OrderInterface } from "@/app/utils/orderInterface"
import superAdminAuth from "@/app/auths/superAdminAuth"



const AdminOrderComponent= () =>{
  const [orders, setOrders] = useState<OrderInterface[]>([])
  const [loading, setLoading] = useState(true)
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const router=useRouter()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/orders`, {
          withCredentials: true,
        })
        setOrders(res.data.data)
      } catch (err) {
        console.error("Error fetching orders", err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  if (loading)
    return <p className="text-center py-6 text-gray-500">Loading orders...</p>

  return (
  
<div className="p-4 md:p-6 min-h-screen bg-gradient-to-b from-blue-400 to-blue-700  ">

      <h1 className="text-xl font-semibold text-gray-800 mb-4">
        Platform Orders Overview
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found</p>
      ) : (
        <div className="overflow-x-auto bg-whkoite shadow rounded-xl">

          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border p-2 text-left">Order ID</th>
                <th className="border p-2 text-left">Buyer</th>
                <th className="border p-2 text-left">Payment</th>
                <th className="border p-2 text-left">TransactionId</th>
                <th className="border p-2 text-left">Total</th>
                <th className="border p-2 text-left">Status</th>
                <th className="border p-2 text-left">Date</th>
                <th className="border p-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b ">
                  <td className="border p-2 truncate text-gray-700">
                    {order._id}
                  </td>
                  <td className="border p-2 text-gray-700">
                    <p className="font-medium">{order.userId?.username || "N/A"}</p>
                    <p className="text-xs text-gray-500">
                      {order.userId?.email}
                    </p>
                  </td>
                  <td className="border p-2 capitalize text-gray-700">
                    {order.paymentMethod || "N/A"}
                  </td>
                  <td className="border p-2 capitalize text-gray-700">
                    {order.transactionId|| "N/A"}
                  </td>
                  <td className="border p-2 font-semibold text-gray-800">
                    ${order.totalPrice.toFixed(2)}
                  </td>
                  <td className="border p-2">
                    {order.cancelled ? (
                      <span className="text-red-600 font-medium">Cancelled</span>
                    ) : order.isDelivered ? (
                      <span className="text-green-600 font-medium">
                        Delivered
                      </span>
                    ) : order.isPaid ? (
                      <span className="text-yellow-600 font-medium">Paid</span>
                    ) : (
                      <span className="text-gray-500">Pending</span>
                    )}
                  </td>
                  <td className="border p-2 text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => router.push(`/admin/orders/${order._id}`)}
                      className="bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default superAdminAuth(AdminOrderComponent)