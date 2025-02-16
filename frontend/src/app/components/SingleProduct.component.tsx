import axios, { AxiosError } from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'



const SingleProductComponent = ({ productId }: { productId: string | null }) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const searchParams = useSearchParams()
  const rating = Number(searchParams.get('rating')) || 0
  const [product, setProduct] = useState({
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
  })
  const router = useRouter()
  useEffect(() => {
    const getSingleProduct = async () => {
      try {
        if (!productId) {
          return router.push("/")
        }
        const res = await axios.get(`${API_URL}/get-single-product/${productId}`);
        setProduct(res.data.data);
      } catch (error: unknown) {
        console.log('singleProductError', error)
        if (error instanceof AxiosError) {
          console.log('instanceofsingleProductError', error)

          return;
        }
      }
    };

    getSingleProduct();
  }, [API_URL, router, productId, setProduct]);



  return (
    <>
      <div className="bg-white shadow-md rounded-lg p-6 w-full mt-9 flex md:flex-row flex-col  justify-center items-center  ">

        {product.image ? (
          <Image
            src={product.image}
            alt={product.title}
            className=" object-cover rounded-t-md mb-4 mr-5"
            width={400}
            height={400}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center  rounded-t-md mb-4">
            <p className="text-gray-500">loading...</p>
          </div>
        )}


        <div className="flex flex-col  space-y-4">
          <h1 className='text-xl font-semibold text-gray-900 border-b pb-2 mb-4'>Product</h1>
          <h1 className="text-lg font-bold text-gray-800 truncate" >
            {product.title || "Untitled Product"}
          </h1>
          <p className="text-sm text-gray-600">description:{product.description || "No description available."}</p>
          <div className="text-gray-800">
            <h2 className="text-base font-semibold">
              Price: <span className="text-green-600">${product.price.toFixed(2)}</span>
            </h2>
            <h2 className="text-base font-semibold">
              Brand: <span className="text-gray-700">{product.brand || "Unknown"}</span>
            </h2>

          </div>
          <div className="flex items-center justify-center space-x-1 mt-1">


            {Array.from({ length: 5 }).map((_, index) => (
              <span
                key={index}
                className={`text-2xl ${index < Math.round(rating) ? "text-yellow-400" : "text-gray-300"}`}
              >
                {index < Math.round(rating) ? "★" : "☆"}

              </span>
            ))}
            <Link 
              className='text-gray-700 underline hover:text-black hover:underline cursor-pointer'
            href="#review"
            scroll={true}
            >
            {rating === 0 ? "No" : rating} ratings
            </Link>
           
          </div>
        </div>

       
      </div>
   


    </>
  )
}

export default SingleProductComponent
