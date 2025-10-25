"use client";

import React, { useEffect, useState } from "react";
import AddressComponent from "./Address.component";
import axios, { AxiosError } from "axios";
import buyerAuth from "../../auths/buyerAuth";
import SingleProductComponent from "./GetProductsByIds.component";
import { useRouter, useSearchParams } from "next/navigation";

const ShippingComponent = () => {

  const orderSummaryStructure = {
    items: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0
  }
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [loading, setLoading] = useState<boolean>(false)
  const [orderSummary, setOrderSummary] = useState(orderSummaryStructure)
  const searchParams = useSearchParams()
  const decoded = JSON.parse(atob(searchParams.get("query") || ""))
    const [savedAddress, setSavedAddress] = useState<boolean>(false)
  

  const router = useRouter()
  const getAddress = async () => {

    try {
      const res = await axios.get(`${API_URL}/find-address`, { withCredentials: true })
      if (res.data.success) {
        setSavedAddress(true)

      }


    } catch (error: unknown) {
      if (error instanceof AxiosError) {

        if (!error.response?.data.success) {
          setSavedAddress(false)

        }
      }

    }
  };
  useEffect(() => {
    getAddress()
  }, []);



  useEffect(() => {
    const formdata = {
      "products": [{
        "productId": decoded.productId,
        "quantity":decoded.quantity
      },
      ],


    }
    const previewOrder = async () => {
      
        const res = await axios.post(`${API_URL}/preview-order`, formdata)
        setOrderSummary(res.data.data)
      
      
    }
    previewOrder()

  }, [API_URL])





  const handleProceedPay = async () => {
    setLoading(true)
  
    setTimeout(() => {
      setLoading(false)  
    }, 1000);

    if (!savedAddress) {
        alert("Please add a shipping address before proceeding to payment.");
        return;
      }

    router.push(`/buyer/payment-cashier?query=${btoa(JSON.stringify({productIdsAndQtyArr: [{ productId: decoded.productId, quantity: decoded.quantity }], price: decoded.price }))}`)
  }
  return (
    <>
      <div className=" bg-transparent h-full  grid grid-row-2  w-full p-4">


        {
          loading && <div className="fixed top-0 left-0 w-full h-full bg-gray-200 bg-opacity-80 flex flex-col justify-center items-center z-50">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-700 border-b-blue-500 rounded-full animate-spin"></div>
            <p className="text-black text-lg mt-4 border-t-black ">loading...</p>
          </div>
          }



      
        <div className="flex  flex-wrap">



          <div className="w-auto max-w-md text-gray-800 bg-transparent rounded-lg shadow-md p-6 mt-10">
            <h1 className="text-xl font-semibold text-gray-900 border-b pb-2 mb-4">
              Order Summary
            </h1>
            <p className="text-sm text-gray-600 mb-4">
              order cancelling is not allowed after 30 minutes of placing order
            </p>
            <div className="space-y-3">
              <h2 className="flex justify-between text-sm font-medium">
                <span>Items Total ({orderSummary.items}):</span>
                <span>PKR{' '}{decoded.price}</span>
              </h2>
              <h2 className="flex justify-between text-sm font-medium">
                <span>Delivery Fee:</span>
                <span>PKR{' '}{orderSummary.shippingPrice}</span>
              </h2>
              <h2 className="flex justify-between text-sm font-medium">
                <span>Tax Price:</span>
                <span>PKR{' '}{orderSummary.taxPrice}</span>
              </h2>
              <h2 className="flex justify-between text-lg font-semibold text-gray-900">
                <span>Total:</span>
                <span>PKR{' '}{orderSummary.totalPrice.toFixed(2)}</span>
              </h2>
            </div>
            <button onClick={handleProceedPay} className="mt-6 w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition-all">
              {loading ? 'loading...' : 'Proceed to Pay'}
            </button>
          </div>
          <div className="w-auto max-w-md text-gray-800 bg-transparent border rounded-lg shadow-md p-6 mt-10">

            <SingleProductComponent productIds={[decoded.productId]} />

          </div>

          <div className="bg-transparent">

            <AddressComponent  />
          </div>

        </div>
      </div>

    </>

  );

};

export default buyerAuth(ShippingComponent);
