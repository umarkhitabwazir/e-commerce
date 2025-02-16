"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import SingleProductComponent from "./SingleProduct.component";
import ReviewComponent from "./Review.component";

interface FormData {
  quantity: number;
}

const OrderPage = () => {
  const {  handleSubmit, formState: { errors }, setValue, setError, clearErrors } = useForm<FormData>();
  const LOCAL_HOST = process.env.NEXT_PUBLIC_LOCAL_HOST;
  const [loading, setLoading] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState<number | null>(1);
  const searchParams = useSearchParams();
  const productId = searchParams.get("product");
  const productPrice = searchParams.get("p");
  const stock: number = parseInt(searchParams.get("stock") || "1");

  const router = useRouter();

  useEffect(() => {
    if (!productId || !productPrice) {
      router.push("/");
    }
  }, [router,productId,productPrice]);

  const onSubmit: SubmitHandler<FormData> = async () => {
    if (!selectedQuantity) {
      setError("quantity", { type: "manual", message: "Quantity is required" });
      return;
    }

    if (stock < selectedQuantity) {
      setError("quantity", { type: "manual", message: "Quantity exceeds available stock" });
      return;
    }

    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push(`${LOCAL_HOST}/shipping?product=${productId}&q=${selectedQuantity}&p=${productPrice}`);
    } catch (error) {
      console.error("Error processing order:", error);
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
        <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-80 flex flex-col justify-center items-center z-50">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-700 border-b-blue-500 rounded-full animate-spin"></div>
          <p className="text-black text-lg mt-4">Processing Order...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center bg-gray-100 min-h-screen w-full  p-6">
          {/* Order Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-lg p-6 w-full ">
<div className="flex justify-center items-center">
<h1 className="text-xl font-semibold text-gray-800 mb-4">Select Quantity</h1>

</div>
            <div className="flex justify-center w-full gap-4 mb-6">
              {[1, 2, 3].map((qty) => (
                <button
                  key={qty}
                  type="button"
                  onClick={() => handleQuantityChange(qty)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    selectedQuantity === qty
                      ? "bg-blue-500 text-white shadow-lg"
                      : "bg-gray-200 text-gray-700 hover:bg-blue-100"
                  }`}
                >
                  {qty}
                </button>
              ))}
            </div>
            {errors.quantity && (
              <p className="text-red-500 text-sm mb-4">{errors.quantity.message}</p>
            )}
            <SingleProductComponent productId={productId} />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200"
            >
              Buy Now
            </button>
          </form>
          <h1 id='review' className="text-gray-400 mt-10 text-xl">Reviews for this Product</h1>
          <ReviewComponent productId={productId}/>
        </div>
      )}
    </>
  );
};

export default OrderPage;
