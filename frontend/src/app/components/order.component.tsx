"use client"
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import withAuth from "../utils/withAuth";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

type Product = {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: number;
  numReviews: number;
  countInStock: number;
  brand: string;
  user: string;
};

interface OrderPageProps {
  user: {
    username: string;
    email: string;
    fullName: string;
    role: string;
    password: string;
    address: string;
    phone: number;
  };
}

interface FormData {

  quantity: number;
}

const OrderPage: React.FC<OrderPageProps> = ({ user }) => {

  const { register, handleSubmit, formState: { errors }, setError, clearErrors } = useForm<FormData>();
  const [product, setProduct] = useState<Product>({
    title: "",
    price: 0,
    description: "",
    category: "",
    image: "",
    rating: 0,
    numReviews: 0,
    countInStock: 1,
    brand: "",
    user: ""
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const LOCAL_HOST = process.env.NEXT_PUBLIC_LOCAL_HOST;
  const [loading, setLoading] = useState<boolean>(false)
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  
  const router = useRouter()
  
  useEffect(() => {
    let fetchData = async () => {
     
      setLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 2000))
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  })

  useEffect(() => {
    const getSingleProduct = async () => {
      try {
        if (!productId) {
          return router.push("/")
        }
        const res = await axios.get(`${API_URL}/get-single-product/${productId}`, { withCredentials: true });
        console.log("Product fetched:", res.data.data);
        setProduct(res.data.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    getSingleProduct();
  }, [API_URL, productId]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log("Form Data:", data);
    if (product.countInStock < data.quantity) {

      setError("quantity", { type: "manual", message: "Quantity is out of stock" });
      return;
    }
    router.push(`${LOCAL_HOST}/buying?q=${data.quantity}&product=${productId}`)


    // Perform further actions like sending the data to the API
  };

  return (
    <>
      {
        loading ? <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-80 flex flex-col justify-center items-center z-50">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-700 border-b-blue-500 rounded-full animate-spin"></div>
          <p className="text-black text-lg mt-4 border-t-black ">loading...</p>
        </div> :
          <div className="flex flex-row lg:flex-row  bg-gray-100 min-h-screen w-screen   p-20">
            {/* Product Details */}
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg w-full min-h-screen lg:mb-0 lg:mr-10">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.title}
                  width={100}
                  height={100}
                  className="rounded-md"
                />
              ) : (
                <p>No image available</p>
              )}
              <p className="text-gray-600 mb-4">{product.description}</p>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                price:{product.price.toFixed(2)}
              </h2>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                brand:{product.brand}
              </h2>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                rating:{product.rating || "no rate"}
              </h2>


            </div>

            {/* Order Form */}
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full min-h-screen">
              <form onSubmit={handleSubmit(onSubmit)} className="w-full min-h-screen">


                {/* Quantity Selection */}
                <div className="mb-6">
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Select Quantity
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    className={`block w-full text-black border rounded-lg p-2 ${errors.quantity ? "border-red-500" : "border-gray-300"
                      }`}
                    min={1}
                    max={3}
                    {...register("quantity", {
                      required: "Quantity is required",
                      valueAsNumber: true,
                      validate: (value) =>
                        value > 0 || "Quantity must be greater than 0",
                    })}
                  />
                  {errors.quantity && (
                    <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg py-2"
                >
                  buy Now
                </button>
              </form>
            </div>
          </div>
      }

    </>

  );
};

export default withAuth(OrderPage);
