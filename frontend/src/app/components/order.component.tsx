"use client"
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import withAuth from "../utils/withAuth";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import SingleProductComponent from "./SingleProduct.component";
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
  const productId = searchParams.get("product");
  console.log("productId",productId)
  const router = useRouter()
  


 
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (product.countInStock < data.quantity) {

      setError("quantity", { type: "manual", message: "Quantity is out of stock" });
      return;
    }
    

      let formdata={
        "products":[{
          "productId": productId,
          "quantity":data.quantity
           },
          ],
          
   
      }
      try {
        let res=await axios.post(`${API_URL}/order`,formdata,{withCredentials:true})
        console.log("res",res)
        console.log("res",'res')
        let fetchData = async () => {
     
          try {
            setLoading(true)
            await new Promise(resolve => setTimeout(resolve, 2000))
          } catch (error) {
            console.log(error)
          } finally {
            setLoading(false)
          }
        }
        fetchData()
        router.push(`${LOCAL_HOST}/buying?product=${productId}`)
      } catch (error) {
        console.log("buyingComponenterror",error)
      }
    


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
            <SingleProductComponent productId={productId}/>

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
