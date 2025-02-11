"use client";

import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';

const Products = () => {
  const [sort, setSort] = useState<string | null>(null); // Sort state
  const [products, setProducts] = useState([]); // Product data state
  const [error, setError] = useState<string | null>(null); // Error state
  const router = useRouter()
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const LOCAL_HOST = process.env.NEXT_PUBLIC_LOCAL_HOST;
  const routePath = usePathname()
  const routes = ["/"]
  const productPath = routes.includes(routePath)
  const [prodcutsIds, setProdcutsIds] = useState([])
  const searchParams = useSearchParams()
  const value = searchParams.get("sort")
  const [reviews, setReviews] = useState([])

console.log("products",products)







  useEffect(() => {
    const fetchData = async () => {
      try {

        await new Promise((resolve) => setTimeout(resolve, 2000));

      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
      }
    };

    fetchData();
  }, []);


  useEffect(() => {


    try {

      if (value) {
        setSort(value);
        if (!productPath) {
          router.push("/")
        }
      } else {
        setSort(null); // Clear sort if not provided
      }
    } catch (err) {
      console.log('Error  searchParams:', err);
      setSort(null); // Clear sort in case of invalid JSON
    }

  }, [searchParams, setSort, router, productPath, value]);

  // Fetch products based on the `sort` state
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const endpoint = sort ? `${API_URL}/${sort}` : `${API_URL}/get-products`;
        const response = await axios.get(endpoint);
        const productsIdArr = response.data.data.map((product: { _id: string; }) => product._id)
        console.log("productsIdArr", productsIdArr)
        setProdcutsIds(productsIdArr)
        setProducts(response.data.data);
        setError(null);
      } catch (err: unknown) {
        if (err instanceof AxiosError) {

          setError(err?.message || 'An error occurred while fetching products.');
        }

      }
    };

    fetchProducts();
  }, [API_URL, sort]); // Run whenever `sort` changes


  const productIdsArr = prodcutsIds
  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const res = await axios.get(`${API_URL}/get-all-reviews/${productIdsArr}`);
        console.log("res", res)
        const reviews = res.data.data
        console.log("get-all-reviews", reviews)
        setReviews(reviews);
      } catch (error: unknown) {
        if (error instanceof AxiosError) {

          if (error.code === "ERR_NETWORK") {
            return;

          }
        }

        return;
      } finally {
      }
    }
    fetchAllReviews();
  }, [API_URL, prodcutsIds, productIdsArr, setReviews,])

  // productHandlers
  const productHandlers = (product: { _id: string, price: number, countInStock: number }) => {
    router.push(`${LOCAL_HOST}/order?product=${product._id}&p=${product.price}&stock=${product.countInStock}`)
  }
  return (
    <>

      <div className="bg-bgGray min-h-screen   p-10">

        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <div className={` grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8`}>
            {products.map(
              (product: {
                _id: string;
                image: string;
                description: string;
                price: number;
                title: string;
                countInStock: number;
                brand: string;
              }) => (

                <div
                  key={product._id}
                  onClick={() => productHandlers(product)}
                  className="bg-white shadow-md rounded-lg cursor-pointer overflow-hidden transition-transform transform hover:scale-105"
                >
                  <Image
                    className="w-full h-48 object-cover"
                    src={product.image}
                    alt={product.title}
                    width={100}
                    height={48}
                  />
                  <div className="p-4">
                    <h2 className="text-lg font-semibold mb-1">{product.title}</h2>
                    <p className="text-sm text-gray-500">{product.brand}</p>
                    <p className="text-gray-700 text-sm truncate mt-2">{product.description}</p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-xl font-bold text-green-600">${product.price}</span>
                      {product.countInStock > 0 ? (
                        <span className="text-sm text-green-500">In Stock</span>
                      ) : (
                        <span className="text-sm text-red-500">Out of Stock</span>
                      )}

                    </div>
                    <div className="flex items-center justify-center space-x-1 mt-1">
                      {/* <span className='text-gray-700'>4.1</span> */}
                      {
                        reviews && reviews.map((reviews: { product: string, rating: number }) => (
                          reviews.product === product._id && reviews.rating > 0 ?

                            [reviews.rating].map((num) =>

                              Array(num).fill(1).map((_, index) => {
                                console.log('reviews.product', [{ id: product._id }])
                                return <div key={index}>

                                  <span
                                    className={`cursor-pointer text-2xl ${"text-yellow-400"}`}>
                                    ★
                                  </span>
                                  {
                                    Array(5 - num).fill(1).map((_, index) => (
                                      <span key={index}
                                        className={`cursor-pointer text-2xl ${"text-gray-300"}`}>
                                        ☆
                                      </span>
                                    ))
                                  }
                                </div>

                              })

                            )
                            :
                            null
                        )

                        )
                      }
                      {/* {[1].map((num) => (
                        <span
                          key={num}
                          className={`cursor-pointer text-2xl ${"text-gray-300"}`}
                        // onClick={() => setRating(num)}
                        >
                          ★
                        </span>
                      ))}
                      <span className='text-gray-700'>(15)</span>
                     */}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </>

  );
};

export default Products;
