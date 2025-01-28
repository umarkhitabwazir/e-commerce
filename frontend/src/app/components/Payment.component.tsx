"use client";
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import withAuth from '../utils/withAuth';

const PaymentComponent = () => {
    const [selectedPayment, setSelectedPayment] = useState('');
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const LOCAL_HOST = process.env.NEXT_PUBLIC_LOCAL_HOST;
    const searchParams = useSearchParams();
    const productId = searchParams.get("product");
    const [loading, setLoading] = useState(false)
    const productPrice = searchParams.get("p");
    const quantity: number = parseInt(searchParams.get("q") || "1");
    const router = useRouter()

    const handlePaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedPayment(event.target.value);
    };

    const handleProceed = async () => {
        setLoading(true)
        if (selectedPayment) {
            try {

                let paymentMethod = selectedPayment;
                let res = await axios.post(`${API_URL}/create-order`, {
                    "products": [{
                        "productId": productId,
                        "quantity": quantity,
                    }

                    ],
                    "paymentMethod": paymentMethod,
                }, { withCredentials: true });
                let data = res.data;
                console.log("data", data)
                router.push('/your-orders')
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
        <div className="text-black max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
            <h1 className="text-xl font-bold mb-4 text-center">Select Payment Method</h1>
            <div className="space-y-3">
                <div className="flex items-center">
                    <input
                        type="radio"
                        id="JazzCash"
                        name="payment"
                        value="JazzCash"
                        className="mr-2 w-4 h-4"
                        onChange={handlePaymentChange}
                    />
                    <label htmlFor="JazzCash" className="text-gray-700">JazzCash</label>
                </div>
                <div className="flex items-center">
                    <input
                        type="radio"
                        id="credit"
                        name="payment"
                        value="Credit Card"
                        className="mr-2 w-4 h-4"
                        onChange={handlePaymentChange}
                    />
                    <label htmlFor="credit" className="text-gray-700">Credit Card</label>
                </div>
                <div className="flex items-center">
                    <input
                        type="radio"
                        id="cod"
                        name="payment"
                        value="Cash"
                        className="mr-2 w-4 h-4"
                        onChange={handlePaymentChange}
                    />
                    <label htmlFor="cod" className="text-gray-700">Cash on Delivery</label>
                </div>
            </div>
            <div className="mt-6 text-center">
                <button
                    className={`${selectedPayment ? "" : "hidden"} bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full`}
                    onClick={handleProceed}
                >
                    {loading ? "loading..." : selectedPayment === "Cash" ? "Confirm Order" : "Proceed"}
                </button>
            </div>

        </div>
    );
};

export default withAuth(PaymentComponent);
