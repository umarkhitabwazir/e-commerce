"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import GetProductsByIdsComponent from "./GetProductsByIds.component";
import PolicyLinksCoponent from "../PolicyLinks.coponent";


interface FormData {
  quantity: number;
}

const OrderPage = () => {
  const {  formState: { errors }, setValue, setError, clearErrors } = useForm<FormData>();

  const [loading, setLoading] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState<number | null>(1);
  const searchParams = useSearchParams();
  const decoded = searchParams.get("query") && JSON.parse(atob(searchParams.get("query") || ""));

  const router = useRouter();

  useEffect(() => {
    if (!searchParams.get("query")) {
      return;
    }
  }, [ decoded]);

  const onSubmit = async () => {
if (!decoded) {
  setError("quantity", { type: "manual", message: "Invalid order data. Please try again." });
  alert("Invalid order data. Please try again.");
       if (window.history.length>1) {
      router.back()
    }else{
        router.push('/')
    }
  return;
}

    if (!selectedQuantity) {
      setError("quantity", { type: "manual", message: "Quantity is required" });
      return;
    }

    if (decoded.stock < selectedQuantity) {
      setError("quantity", { type: "manual", message: "Quantity exceeds available stock" });
      return;
    }

    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push(`/buyer/shipping?query=${btoa(JSON.stringify({ productId: decoded.productId, quantity: selectedQuantity, price: decoded.price }))}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
return;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (quantity: number) => {
    setSelectedQuantity(quantity);
    setValue("quantity", quantity, { shouldValidate: true });
    clearErrors("quantity");
  };

  return (
    <>
      {loading ? (
        <div className=" w-full h-auto min-h-screen  flex flex-col justify-center items-center z-50">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 border-b-blue-500 rounded-full animate-spin"></div>
          <p className="text-black text-lg mt-4 font-medium">Processing Order...</p>
        </div>
      ) : (
        <div className="   w-full ">
          {/* Order Form */}

          <div  className="rounded-lg flex flex-wrap justify-evenly  w-full ">
    {/* Quantity Buttons */}
            <div>

              <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">Select Quantity</h1>

              <div className="flex justify-center w-full gap-4 mb-6">
                {[1, 2, 3].map((qty) => (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => handleQuantityChange(qty)}
                    className={`px-6 py-3 rounded-lg  font-semibold transition-all duration-200 text-lg ${selectedQuantity === qty
                      ? "bg-blue-600 text-white shadow-md transform scale-105"
                      : "bg-gray-200 text-gray-700 hover:bg-blue-100 hover:shadow-md"
                      }`}
                  >
                    {qty}
                  </button>
                ))}
              </div>
                  {/* Error Message */}
            {errors.quantity && (
              <p className="text-red-500 text-sm text-center mb-4">{errors.quantity.message}</p>
            )}
              {/* Buy Now Button */}
              <div className="flex justify-center items-center w-full">

                <button
                  onClick={onSubmit}
                  className="w-full max-w-lg bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all duration-200 shadow-lg transform  active:scale-95"
                >
                  Buy Now
                </button>
              </div>
              <div className="mt-3">

                <PolicyLinksCoponent/>
              </div>
            </div>
        

            {/* Product Details */}
            {
              decoded ?
            <div className="" >

              <GetProductsByIdsComponent productIds={[decoded.productId]} />
            </div>
            : <p className="text-red-600 font-light flex justify-center items-center mt-4">Invalid order details provided.</p>
            }

        
      
          </div>


        </div>

      )}
    </>
  );
};

export default OrderPage;
