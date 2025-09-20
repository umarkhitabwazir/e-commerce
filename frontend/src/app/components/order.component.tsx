"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import SingleProductComponent from "./GetProductsByIds.component";
import ReviewComponent from "./Review.component";


interface FormData {
  quantity: number;
}

const OrderPage = () => {
  const { handleSubmit, formState: { errors }, setValue, setError, clearErrors } = useForm<FormData>();

  const [loading, setLoading] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState<number | null>(1);
  const searchParams = useSearchParams();
  const decoded = JSON.parse(atob(searchParams.get("query") || ""));

  const router = useRouter();

  useEffect(() => {
if (!searchParams.get("query")) {
  console.log("no query param");
  return;
}
  }, [router, decoded]);

  const onSubmit: SubmitHandler<FormData> = async () => {
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
      router.push(`/shipping?query=${btoa(JSON.stringify({ productId: decoded.productId, quantity: selectedQuantity, price: decoded.price }))}`);
    } catch (error:unknown) {
      if (error instanceof Error) {
        console.error("Error processing order:", error.message);
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
        <div className="fixed top-0 left-0  w-full h-full  flex flex-col justify-center items-center z-50">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 border-b-blue-500 rounded-full animate-spin"></div>
          <p className="text-black text-lg mt-4 font-medium">Processing Order...</p>
        </div>
      ) : (       
        <div className="flex flex-col    justify-center items-center  min-h-screen w-full ">
          {/* Order Form */}
         
          <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg p-8 w-full ">
        

            {/* Product Details */}
            <SingleProductComponent productIds={[decoded.productId]} />

            {/* Quantity Buttons */}

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
            {/* Buy Now Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all duration-200 shadow-lg transform  active:scale-95"
            >
              Buy Now
            </button>
                {/* Error Message */}
            {errors.quantity && (
              <p className="text-red-500 text-sm text-center mb-4">{errors.quantity.message}</p>
            )}
          </form>

          {/* Reviews Section */}
          <h1 id="review" className="text-gray-500 mt-10 text-xl font-medium">Reviews for this Product</h1>
          <ReviewComponent productId={decoded.productId} />
        
        </div>
       
      )}
    </>
  );
};

export default OrderPage;
