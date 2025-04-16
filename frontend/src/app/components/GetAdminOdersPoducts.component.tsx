'use client'
import axios, { AxiosError } from 'axios'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react'
import adminOrdersInterface from '../utils/AdminOrdersInterface';
import Image from 'next/image';
import withAuth from '../utils/withAuth';

const AdminOrdersComponent = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [adminOrders, setAdminOrders] = React.useState<adminOrdersInterface[]>([])
  const searchParams = useSearchParams()
  const updatedSearchParams = new URLSearchParams(searchParams.toString())
  const router = useRouter()

  const fetchAdminOdersPrpoducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/get-ordered-products`, { withCredentials: true })
      const data = await response.data.data
      
      setAdminOrders(data)
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data)
        const notLoggedIn = error.response?.data.error === 'Unauthorized'
        if (notLoggedIn) {

          router.push(`/login?track=${updatedSearchParams.toString()}`)

        }

      }

    }
  }

  useEffect(() => {
   
    fetchAdminOdersPrpoducts()
  }, [API_URL])

  // handleOrderConfirmation
  const handleOrderConfirmation = async (orderId: string) => {
    
    try {
      await axios.patch(`${API_URL}/order-confirmation/${orderId}`, {}, { withCredentials: true })
     
     await fetchAdminOdersPrpoducts()
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
    
    await fetchAdminOdersPrpoducts()

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
 
    await fetchAdminOdersPrpoducts()

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
    
    await fetchAdminOdersPrpoducts()

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
    await fetchAdminOdersPrpoducts()

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
   
    await fetchAdminOdersPrpoducts()

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

    <div className="space-y-4 p-4">
      {adminOrders.length <= 0 ?
        <div className="text-center flex justify-center p-20 text-gray-700">
          <p>No order founded</p>
        </div>

        : adminOrders.map((order, index) => (


          <div
            key={index}
            className="border border-gray-300 shadow-sm rounded-lg p-4 bg-white"
          >

            <div className={` grid  grid-cols-3 gap-4 text-gray-700`}>

              {order.products.map((p: { productId: { image: string, _id: string } }) =>
                <div key={p.productId._id} >
                  <p className="font-semibold">Product ID:</p>
                  <p>{p.productId._id}</p>
                  <Image src={p.productId.image} alt='product-img' width={70} height={70} />
                </div>
              )}
              <div>
                <p className="font-semibold">Email:</p>
                <p>{order.userId.email}</p>
              </div>
              <div>
                <p className="font-semibold">Phone:</p>
                <p>{order.userId.phone}</p>
              </div>
              <div>
                <p className="font-semibold">Username:</p>
                <p>{order.userId.username}</p>
              </div>
              <div>
                <p className="font-semibold">Order Date:</p>
                <p>{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="font-semibold flex">Total Price:</p>
                <p>${order.totalPrice}</p>

                <p className='text-sm font-extralight'>including tax & shipping</p>


              </div>
              <div>
                <p className="font-semibold">Quantity:</p>
                <p>{order.products.map((p) => p.quantity)}</p>
              </div>


              <div>
                <p className="font-semibold">Payment Method:</p>
                <p>{order.paymentMethod}</p>
              </div>
              <div>
                <p className="font-semibold">Change Payment Status:</p>
                <button onClick={()=>handlePaymentConfirmation(order._id)} className={`${order.isPaid ? "text-green-600  bg-blue-700 hover:bg-blue-600 p-2 rounded-md" : " bg-red-500 hover:bg-red-400 "} font-bold p-2 rounded-md w-full  text-white`}>
                  {order.isPaid ? "Paid" : "Not Paid"}
                </button>
              </div>
              <div>
                <p className="font-semibold">Change order Confirmation:</p>
                <button onClick={() => handleOrderConfirmation(order._id)} className={`${order.confirmed ? "text-green-600 bg-blue-700 hover:bg-blue-600" : "bg-red-500 hover:bg-red-400 "}  font-bold p-2 rounded-md w-full text-white`}>
                  {  order.confirmed ? "Order Confirmed" : "Order Not Confirmed"}
                </button>
              </div>
              <div>
                <p className="font-semibold">Change Picked by Counter:</p>
                <button onClick={() => handlePickByCounter(order._id)} className={`${order.pickedByCounter ? "text-green-600 bg-blue-700 hover:bg-blue-600" : "bg-red-500 hover:bg-red-400 "}  font-bold p-2 rounded-md w-full text-white`}>
                  {  order.confirmed ? "Order  Picked by counter" : "Order NotPicked by counter"}
                </button>
              </div>
              <div>
                <p className="font-semibold">Change Shipping status:</p>
                <button onClick={()=>handleOrderShipping(order._id)} className={`${order.orderShipped ? "text-green-600 bg-blue-700 hover:bg-blue-600" : "bg-red-500 hover:bg-red-400 "}  font-bold p-2 rounded-md w-full text-white`}>
                  { order.orderShipped ? "Order Shipped" :  "Order Not Shipped"}
                </button>
              </div>
              <div>
                <p className="font-semibold">Change ready For Pickup Status:</p>
                <button onClick={()=>handleOrderReadyForPickUp(order._id)} className={`${order.readyForPickup ? "text-green-600 bg-blue-700 hover:bg-blue-600" : "bg-red-500 hover:bg-red-400 "}  font-bold p-2 rounded-md w-full text-white`}>
                  {  order.readyForPickup ? "ready for pickup" : "Not ready for pickup"}
                </button>
              </div>

              <div>
                <p className="font-semibold">Change Delivery Status:</p>
                <button onClick={()=>handleOrderDelivered(order._id)} className={`${order.isDelivered ? "text-green-600 bg-blue-700 hover:bg-blue-600" : "bg-red-500 hover:bg-red-400 "}  font-bold p-2 rounded-md w-full text-white`}>
                  {  order.isDelivered ? "Delivered" :"Not Delivered"}
                </button>
              </div>

         
              <div>
                <p className="font-semibold"> Order Status:</p>
                <p className={order.cancelled ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
                  {order.cancelled ? "Cancelled" : "Active"}
                </p>
              </div>
            </div>
          </div>

        ))}
    </div>


  )
}




export default withAuth( AdminOrdersComponent)
