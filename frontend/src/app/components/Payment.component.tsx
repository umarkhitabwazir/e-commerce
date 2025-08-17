"use client";
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import withAuth from '../utils/withAuth';
import SingleProductComponent from './SingleProduct.component';

const PaymentComponent = () => {
  const [selectedPayment, setSelectedPayment] = useState('');
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const searchParams = useSearchParams();
  const price = searchParams.get('p')

  const productId = searchParams.get("product");
  const productIdArr=JSON.parse(searchParams.get("ids") || '[]')
  const [loading, setLoading] = useState(false)
  const quantity: number = parseInt(searchParams.get("q") || "1");
  const router = useRouter()

  const handlePaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPayment(event.target.value);
  };

  const handleProceed = async () => {
    setLoading(true)
    if (selectedPayment) {
      try {

        const paymentMethod = selectedPayment;
        if (productIdArr.length!==0 ) {
          
          await axios.post(`${API_URL}/create-order`, {
            "products":productIdArr,
            "paymentMethod": paymentMethod,
          }, { withCredentials: true });
          
         return router.push(`/your-orders?product=${productId}`)
        }
        if (productId  ) {
          
         await axios.post(`${API_URL}/create-order`, {
            "products": [{
              "productId": productId,
              "quantity": quantity,
            }
  
            ],
            "paymentMethod": paymentMethod,
          }, { withCredentials: true });
         
       return   router.push(`/your-orders?product=${productId}`)
        }
      } catch (error) {
        setLoading(false)

        console.log("error", error)
      } finally {
        setLoading(false)
      }
    } else {
      alert('Please select a payment method.');
    }
  };

  return (
    <div className='flex md:flex-row flex-col  gap-2'>
      <div className="text-gray-800 max-w-lg mx-auto bg-white p-8  rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">Select Payment Method</h1>

        {price && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-center font-medium">
              Total Amount: <span className="font-bold text-blue-700">{price}</span>
            </p>
          </div>
        )}

        <div className="space-y-4 mb-8">
          {[
            { id: "JazzCash", label: "JazzCash" },
            { id: "credit", label: "Credit Card" },
            { id: "cod", label: "Cash on Delivery" }
          ].map((method) => (
            <div
              key={method.id}
              className={`
          flex items-center p-4 rounded-lg border transition-all duration-200 cursor-pointer
          ${selectedPayment === method.label
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100'
                  : 'border-gray-200 hover:border-blue-300'}
        `}
              onClick={() => document.getElementById(method.id)?.click()}
            >
              <input
                type="radio"
                id={method.id}
                disabled={method.id !== 'cod'}
                name="payment"
                value={method.label}
                className="mr-3 w-5 h-5 text-blue-600 cursor-pointer"
                onChange={handlePaymentChange}
                checked={selectedPayment === method.label}
              />
              <label
                htmlFor={method.id}
                className="text-gray-700 font-medium cursor-pointer flex-1"
              >
                {method.label}
              </label>
              {method.id !== "cod" &&
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full ml-2">
                  Payment gateway integration is currently in progress.
                </span>
              }
              {method.id === "cod" && (
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full ml-2">
                  No fee
                </span>
              )}
            </div>
          ))}
        </div>

        <div className={`transition-opacity duration-300 ${selectedPayment ? "opacity-100" : "opacity-0 h-0"}`}>
          <button
            className={`
        w-full py-3 px-4 rounded-lg font-bold text-white transition-all
        shadow-md hover:shadow-lg transform hover:-translate-y-0.5
        ${loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"}
      `}
            onClick={handleProceed}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              selectedPayment === "Cash on Delivery" ? "Confirm Order" : "Proceed to Payment"
            )}
          </button>
        </div>
      </div>
      <div>

     <h3 className="text-xl font-semibold text-gray-900 tracking-tight">
  Selected Items for Checkout
</h3>

      <SingleProductComponent productId={productId} />
      </div>
    </div>
  );
};

export default withAuth(PaymentComponent);
