'use client'
import axios, { AxiosError } from 'axios'
import React, { useEffect, useState } from 'react'
import FavInterface from '../utils/favInterface'
import Image from 'next/image'

const FavouriteProductsComponent = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const [favProducts, setFavProducts] = useState<FavInterface[]>([])
  const getFavProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/get-fav-product`, { withCredentials: true })
      setFavProducts(res.data.data)

    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.log('fav product error', error)
      }
    }
  }
  useEffect(() => {
    getFavProducts()
  }, [])
   const removeFavHandler=async(productId:string)=>{
  try {
        await axios.delete(`${API_URL}/remove-fav/${productId}`,  { withCredentials: true })
        await getFavProducts()
    
  } catch (error:unknown) {
    if (error instanceof AxiosError) {
      console.log('removeFavHandler error',error)
    }
  }
    }
  return (
    <>
  {favProducts.length === 0 && (
  <div className="flex flex-col items-center justify-center p-8 rounded-2xl shadow-sm">
    <h3 className="text-lg font-semibold text-gray-700">
      No favorite product found
    </h3>
    <p className="text-sm text-gray-500 mt-2">
      You haven’t added any products to favorites yet.
    </p>
  </div>
)}

    <div className="animate-fadeIn">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {favProducts.map((fav: FavInterface) => (
          <div key={fav._id} className="bg-white rounded-xl p-4">
            <Image
              className='w-auto h-auto bg-transparent'
              src={fav.item.image}
              width={100}
              height={100}
              alt="fav product img" />
            <p className="font-medium text-gray-800">{fav.item.title}</p>
            <p className="text-gray-600 text-sm mb-2">{fav.item.description}</p>
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-900">{fav.item.price}</span>
              <button
              onClick={()=>removeFavHandler(fav.item._id)}
               className="text-red-500 hover:text-red-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  )
}

export default FavouriteProductsComponent
