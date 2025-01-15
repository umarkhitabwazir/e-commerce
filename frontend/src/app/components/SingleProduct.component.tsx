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
 <div className="bg-white shadow-md rounded-lg p-6 w-full mt-9 flex  justify-center items-center  ">

  {product.image ? (
    <img
      src={product.image}
      alt={product.title}
      className="w-40 h-40 object-cover rounded-t-md mb-4 mr-5"
    />
  ) : (
    <div className="w-40 h-40 bg-gray-200 flex items-center justify-center  rounded-t-md mb-4">
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
      <h2 className="text-base font-semibold">
        Rating: <span className="text-yellow-500">{product.rating || "No rating"}</span>
      </h2>
    </div>
  </div>
</div>

 </>
  )
}

export default SingleProductComponent
