"use client";
import axios, { AxiosError } from 'axios';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import GetProductsByIdsComponent from './GetProductsByIds.component';
import buyerAuth from '../../auths/buyerAuth';

const PaymentComponent = () => {
  const [selectedPayment, setSelectedPayment] = useState('');
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const searchParams = useSearchParams();
  const trackPath = usePathname();
  const updatedSearchParams = new URLSearchParams(searchParams.toString())
  const decoded = searchParams.get('query') !== null && JSON.parse(atob(searchParams.get('query') || ''))
  const productIds = decoded.productIdsAndQtyArr ? decoded.productIdsAndQtyArr.map((item: { productId: string; quantity: number }) => item.productId) : []
  const [loading, setLoading] = useState(false)
  const paymentMethods = [
    { id: "JazzCash", label: "JazzCash" },
    { id: "easyPaisa", label: "easyPaisa" },
    { id: "cod", label: "Cash on Delivery" }
  ]
  const [transactionId, setTransactionId] = useState("");




  const [error, setError] = useState<string | undefined>(undefined);
  const router = useRouter()

  const handleTransactionIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTransactionId(value);

    const isValid = /^[A-Za-z0-9]{11,20}$/.test(value);

    setError(isValid ? "" : "Invalid transaction ID format");
  };

  const handlePaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(undefined)
    setSelectedPayment(event.target.value);
  };


  const handleProceed = async () => {
    setLoading(true)
    if (selectedPayment !== "Cash on Delivery" && !transactionId) {
      setLoading(false)
      return setError("transactionId  is required")

    }
    if (selectedPayment) {
      try {

        const paymentMethod = selectedPayment;
        if (!decoded) {
          setError("Invalid order data. Please try again.")
          setLoading(false)
          setTimeout(() => {
            setError(undefined)
          }, 2000);
          if (window.history.length > 1) {
            router.back()
          } else {
            router.push('/')
          }
          return;
        }

        await axios.post(`${API_URL}/create-order`, {
          "products": decoded.productIdsAndQtyArr,
          "paymentMethod": paymentMethod,
          "transactionId": transactionId
        }, { withCredentials: true });

        return router.push(`/buyer/orders?decoded=${btoa(JSON.stringify(decoded))}`)


      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 403) {
            router.push(`/verify-email?track=${trackPath}&${updatedSearchParams}`)

          }
          setError(error.response?.data?.error);

        }
        setLoading(false)
      } finally {
        setLoading(false)
      }
    };
  };

  return (
    <div className='flex md:flex-row flex-col  gap-2'>
      <div className="text-gray-800 max-w-lg mx-auto bg-transparent p-8  rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">Select Payment Method</h1>

        {decoded.price
          && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-center font-medium">
                Total Amount: <span className="font-bold text-blue-700">PKR{' '}{decoded.price}</span>
              </p>
            </div>
          )}

        <div className="space-y-4 mb-8">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
            >

              <div
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

                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full ml-2">
                  No fee
                </span>

              </div>
              <div>
                {selectedPayment === "JazzCash" && selectedPayment === method.label && (
                  <div
                    onClick={() => window.location.href = "jazzcash://pay?number=03281250745"}
                    className="flex flex-wrap flex-col  p-2 border cursor-pointer rounded-b-lg bg-gray-50">

                    <div className='flex gap-2 flex-wrap'>
                      <p className="text-sm font-medium text-gray-700">JazzCash:</p>
                      <span className="text-sm text-gray-900">{process.env.NEXT_PUBLIC_JAZZCASH_NUMBER}</span>
                    </div>

                    <div className='flex gap-2 flex-wrap'>
                      <p className="text-sm font-medium text-gray-700">Holder Name:</p>
                      <span className="text-sm text-gray-900">{process.env.NEXT_PUBLIC_JAZZCASH_HOLDER_NAME}</span>
                    </div>

                  </div>
                )}
                {selectedPayment === "easyPaisa" && selectedPayment === method.label && (
                  <div
                    onClick={() => window.location.href = "easypaisa://pay?number=03281250745"}
                    className="flex flex-col flex-wrap  gap-2 p-2 border cursor-pointer rounded-b-lg bg-gray-50">

                    <div className='flex gap-2 flex-wrap'>

                      <p className="text-sm font-medium text-gray-700">EasyPaisa:</p>
                      <span className="text-sm text-gray-900">{process.env.NEXT_PUBLIC_EASYPAISA_NUMBER}</span>
                    </div>
                    <div className='flex gap-2 flex-wrap'>

                      <p className="text-sm font-medium text-gray-700">Holder Name</p>
                      <span className="text-sm text-gray-900">{process.env.NEXT_PUBLIC_EASYPAISA_HOLDER_NAME}</span>
                    </div>

                  </div>
                )}

              </div>
            </div>
          ))}
          {
            selectedPayment !== "Cash on Delivery" &&
            <div>
              <input
                value={transactionId}
                onChange={handleTransactionIdChange}
                type="text"
                placeholder={`Enter ${selectedPayment} transaction ID`}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />

            </div>
          }
        </div>
        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}
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

        {
          productIds.length === 0 ? (
            <p className="text-red-500 text-center mt-4">No products selected for checkout.</p>
          )
            : (

              <h3 className="text-xl font-semibold text-gray-900 tracking-tight">
                {
                  productIds.length !== 0
                  &&
                  (
                    <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-b-xl px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-gray-700 font-semibold text-sm uppercase tracking-wide">
                            Selected for Checkout
                          </h2>
                          <p className="text-gray-500 text-xs">
                            Ready to complete your purchase
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-blue-600">{productIds.length}</span>
                          <span className="text-gray-500 text-sm font-medium">items</span>
                        </div>
                        <div className="w-full h-1 bg-blue-200 rounded-full mt-1">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min((productIds.length / (productIds.length + 10)) * 100, 100)}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>

                  )
                }
              </h3>
            )
        }

        <GetProductsByIdsComponent productIds={productIds} />
      </div>
    </div>
  );
};

export default buyerAuth(PaymentComponent);
