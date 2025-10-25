'use client'
import axios, { AxiosError } from 'axios'
import {  useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'
import adminOrdersInterface from '../../utils/AdminOrdersInterface';
import Image from 'next/image';
import StatusButtonComponent from '../StatusButton.component';
import sellerAuth from '../../auths/sellerAuth';


const SellerOrdersComponent = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [adminOrders, setAdminOrders] = React.useState<adminOrdersInterface[]>([])
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  
  const updatedSearchParams = new URLSearchParams(searchParams.toString())
  const router = useRouter()

  const fetchData = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);

  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData])
  const fetchAdminOderspoducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/get-ordered-products`, { withCredentials: true })
      const data = await response.data.data
      setAdminOrders(data)
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
       
        const notLoggedIn = error.response?.data.error === 'Unauthorized'
        if (notLoggedIn) {

          router.push(`/login?track=${updatedSearchParams.toString()}`)

        }

      }

    }
  }

  useEffect(() => {

    fetchAdminOderspoducts()
  }, [API_URL])

  // handleOrderConfirmation
  const handleOrderConfirmation = async (orderId: string) => {

    try {
      await axios.patch(`${API_URL}/order-confirmation/${orderId}`, {}, { withCredentials: true })

      await fetchAdminOderspoducts()
    } catch (error: unknown) {
      if (error instanceof AxiosError) {

        const notLoggedIn = error.response?.data.error === 'Unauthorized'
        if (notLoggedIn) {
          router.push(`/login?track=${updatedSearchParams.toString()}`)
        }
      }
    }
  }
  // handlePaymentConfirmation
  const handlePaymentConfirmation = async (orderId: string) => {

    try {
      await axios.patch(`${API_URL}/payment-confirmation/${orderId}`, {}, { withCredentials: true })

      await fetchAdminOderspoducts()

    } catch (error: unknown) {
      if (error instanceof AxiosError) {

        const notLoggedIn = error.response?.data.error === 'Unauthorized'
        if (notLoggedIn) {
          router.push(`/login?track=${updatedSearchParams.toString()}`)
        }
      }
    }
  }
  // handleOrderShipping
  const handleOrderShipping = async (orderId: string) => {

    try {
      await axios.patch(`${API_URL}/order-shipping/${orderId}`, {}, { withCredentials: true })

      await fetchAdminOderspoducts()

    } catch (error: unknown) {
      if (error instanceof AxiosError) {

        const notLoggedIn = error.response?.data.error === 'Unauthorized'
        if (notLoggedIn) {
          router.push(`/login?track=${updatedSearchParams.toString()}`)
        }
      }
    }
  }
  // handleOrderReadyForPickUp 
  const handleOrderReadyForPickUp = async (orderId: string) => {

    try {
      await axios.patch(`${API_URL}/orderReadyForPickUp/${orderId}`, {}, { withCredentials: true })

      await fetchAdminOderspoducts()

    } catch (error: unknown) {
      if (error instanceof AxiosError) {

        const notLoggedIn = error.response?.data.error === 'Unauthorized'
        if (notLoggedIn) {
          router.push(`/login?track=${updatedSearchParams.toString()}`)
        }
      }
    }
  }

  // handleOrderDelivered
  const handleOrderDelivered = async (orderId: string) => {

    try {
      await axios.patch(`${API_URL}/order-delivered/${orderId}`, {}, { withCredentials: true })
      await fetchAdminOderspoducts()

    } catch (error: unknown) {
      if (error instanceof AxiosError) {

        const notLoggedIn = error.response?.data.error === 'Unauthorized'
        if (notLoggedIn) {
          router.push(`/login?track=${updatedSearchParams.toString()}`)
        }
      }
    }
  }
  const handlePickByCounter = async (orderId: string) => {

    try {
      await axios.patch(`${API_URL}/orderPickedByCounte/${orderId}`, {}, { withCredentials: true })

      await fetchAdminOderspoducts()

    } catch (error: unknown) {
      if (error instanceof AxiosError) {

        const notLoggedIn = error.response?.data.error === 'Unauthorized'
        if (notLoggedIn) {
          router.push(`/login?track=${updatedSearchParams.toString()}`)
        }
      }
    }
  }
  return (

    <div className="p-6">
      {loading ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="w-16 h-16 border-4 border-t-cyan-500 border-r-blue-600 border-b-indigo-600 border-l-violet-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 text-lg font-medium">Loading orders...</p>
        </div>
      ) : adminOrders.length <= 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 h-screen flex flex-col justify-center items-center text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders found</h3>
          <p className="text-gray-500 max-w-md mx-auto">All orders will appear here once customers start placing orders.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {adminOrders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
              {/* Order Header */}
              <div className={`px-6 py-4 border-b ${order.cancelled ? "bg-red-50" : "bg-gray-50"}`}>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Order #{order._id.slice(-8).toUpperCase()}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.cancelled
                        ? "bg-red-100 text-red-800"
                        : order.isDelivered
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                      {order.cancelled ? "Cancelled" : order.isDelivered ? "Delivered" : "Active"}
                    </span>
                    <span className="text-lg font-bold text-gray-800">PKR{' '}{order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Order Body */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Customer Information */}
                  <div className="lg:col-span-1">
                    <h4 className="text-md font-semibold text-gray-700 mb-4 pb-2 border-b">Customer Information</h4>
                    {
                      
                      <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium text-gray-400">{order.userId? order.userId.username : "null"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-400">{order.userId ? order.userId.email : "null"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium text-gray-400">{order.userId ? order.userId.phone : 'null'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Payment Method</p>
                        <p className="font-medium text-gray-400">{order.paymentMethod}</p>
                      </div>
                      {/* address */}
                      <div>
                        <p className="text-sm text-gray-500">Shipping Address</p>
                        <div className="font-medium text-gray-400">
                          <p>{order.address ? `Street: ${order.address.Street}` : "null"},{order.address ?`House No:${order.address.HouseNo}`  : "null"}</p>
                          <p>{order.address ? order.address.City : "null"}, {order.address ? order.address.Province : "null"}</p>
                        </div>
                      </div>
                    </div>
                    }
                  </div>

                  {/* Products */}
                  <div className="lg:col-span-1">
                    <h4 className="text-md font-semibold text-gray-700 mb-4 pb-2 border-b">Products</h4>
                    <div className="space-y-4">
                      {order.products.map((p) => (
                        <div key={p.productId._id} className="flex items-start gap-3">

                          <div className="bg-gray-100 border rounded-md overflow-hidden">
                            <Image
                              src={p.productId.image}
                              alt="Product"
                              width={90}
                              height={90}
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{p.productId.title}</p>
                            <div className="flex flex-col flex-wrap gap-1 text-sm mt-1">
                              <span className="text-gray-600">Qty: {p.quantity}</span>
                              <span className="text-gray-600">Price:PKR{' '}{p.productId.price}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Actions */}
                  {!order.cancelled && (
                    <div className="lg:col-span-1">
                      <h4 className="text-md font-semibold text-gray-700 mb-4 pb-2 border-b">Order Management</h4>
                      <div className="space-y-3">
                        <StatusButtonComponent
                          label="Payment Status"
                          status={order.isPaid}
                          trueText="Paid"
                          falseText="Not Paid"
                          onClick={() => handlePaymentConfirmation(order._id)}
                        />

                        <StatusButtonComponent
                          label="Order Confirmation"
                          status={order.confirmed}
                          trueText="Confirmed"
                          falseText="Not Confirmed"
                          onClick={() => handleOrderConfirmation(order._id)}
                        />

                        <StatusButtonComponent
                          label="Counter Pickup"
                          status={order.pickedByCounter}
                          trueText="Picked by Counter"
                          falseText="Not Picked"
                          onClick={() => handlePickByCounter(order._id)}
                        />

                        <StatusButtonComponent
                          label="Shipping Status"
                          status={order.orderShipped}
                          trueText="Shipped"
                          falseText="Not Shipped"
                          onClick={() => handleOrderShipping(order._id)}
                        />

                        <StatusButtonComponent
                          label="Ready for Pickup"
                          status={order.readyForPickup}
                          trueText="Ready"
                          falseText="Not Ready"
                          onClick={() => handleOrderReadyForPickUp(order._id)}
                        />

                        <StatusButtonComponent
                          label="Delivery Status"
                          status={order.isDelivered}
                          trueText="Delivered"
                          falseText="Not Delivered"
                          onClick={() => handleOrderDelivered(order._id)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>


  )
}




export default sellerAuth(SellerOrdersComponent)
