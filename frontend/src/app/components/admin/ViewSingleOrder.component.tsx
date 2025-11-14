"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import { OrderInterface } from "@/app/utils/orderInterface";
import superAdminAuth from "@/app/auths/superAdminAuth";



const ViewSingleOrderComponent=()=> {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/view-single-order/${id}`, {
          withCredentials: true,
        });
        setOrder(res.data.data);
      } catch (err:unknown) {
        if(err instanceof AxiosError){

          console.error("Error fetching order", err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <p className="p-6 text-center text-gray-500">Loading order details...</p>;
  if (!order) return <p className="p-6 text-center text-gray-500">Order not found</p>;

  return (
<div className=" overflow-x-auto p-4 min-h-screen bg-gradient-to-b from-blue-400 to-blue-700 sm:p-6 ">

  <button
    onClick={() => router.back()}
    className="mb-4 bg-gray-200 hover:bg-gray-300 text-black px-3 py-1 rounded text-sm"
  >
    Back
  </button>

  <div className=" shadow rounded-lg md:p-6">
    <h1 className="text-2xl  font-semibold mb-4">Order Details</h1>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        <p><strong>Status:</strong>{" "}
          {order.cancelled
            ? "Cancelled"
            : order.isDelivered
            ? "Delivered"
            : order.isPaid
            ? "Paid"
            : "Pending"}
        </p>
      </div>

      <div>
        <p><strong>Buyer:</strong> {order.userId?.username}</p>
        <p><strong>Email:</strong> {order.userId?.email}</p>
        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
        <p><strong>Transaction ID:</strong> {order.transactionId}</p>
      </div>
    </div>

    <h2 className="text-lg font-medium mb-2">Products</h2>
    <div className="overflow-x-auto ">
      <table className="w-full border-collapse text-sm min-w-[600px] md:min-w-full">
        <thead className="bg-gray-100 text-black">
          <tr>
            <th className="border p-2 text-left">Product</th>
            <th className="border p-2 text-left">Price</th>
            <th className="border p-2 text-left">Quantity</th>
            <th className="border p-2 text-left">Total</th>
            <th className="border p-2 text-left">Seller</th>
          </tr>
        </thead>
        <tbody>
          {order.products.map((item, index) => (
            <tr key={index} className="">
         <td className="border cursor-pointer p-2 flex items-center gap-2">
  <a href={item.productId?.image} target="_blank" rel="noopener noreferrer">
    <Image
      src={item.productId?.image}
      alt={item.productId?.title}
      width={70}
      height={70}
      className="object-cover rounded hover:opacity-80 transition"
    />
  </a>
  {item.productId?.title || "Unknown"}
</td>

              <td className="border p-2">${item.productId?.price?.toFixed(2)}</td>
              <td className="border p-2">{item.quantity}</td>
              <td className="border p-2">
                ${(item.quantity * item.productId?.price).toFixed(2)}
              </td>
              <td className="border p-2">
                {item.productId?.user ? (
                  <div className="text-sm md:text-xs">
                    <p>{item.productId.user.username}</p>
                    <p className="text-gray-300">{item.productId.user.email}</p>
                  </div>
                ) : (
                  <span>Unknown</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="mt-6 text-right">
      <p className="text-lg font-semibold">
        Total: PKR{' '}{order.totalPrice.toFixed(2)}
      </p>
    </div>
  </div>
</div>

  );
}
export default superAdminAuth(ViewSingleOrderComponent)