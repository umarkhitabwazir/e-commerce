import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const SingleProductComponent = ({productId}:{productId:string | null }) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const LOCAL_HOST = process.env.NEXT_PUBLIC_LOCAL_HOST;
  const [product,setProduct]=useState({
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
  const router=useRouter()
     useEffect(() => {
        const getSingleProduct = async () => {
          try {
            if (!productId) {
              return router.push("/")
            }
            const res = await axios.get(`${API_URL}/get-single-product/${productId}`, { withCredentials: true });
            setProduct(res.data.data);
          } catch (error) {
            console.error("Error fetching product:", error);
          }
        };
    
        getSingleProduct();
      }, [API_URL, productId]);
    
  return (
 <>
 <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg w-full  lg:mb-0 lg:mr-10">
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
 </>
  )
}

export default SingleProductComponent
