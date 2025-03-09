"use client";

import React, { useCallback, useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { ProductTypes } from '../utils/productsTypes';
import Loading from './Loading.component';

const Products = () => {
  const [sort, setSort] = useState<string | null>(null);
  const [products, setProducts] = useState([]);
  const [searchResult, setSearchResult] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<{ product: string; rating: number }[]>([]);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
   const routePath = usePathname();
  const searchParams = useSearchParams();
  const searchedProducts = searchParams.get("search")
  const categoryName = searchParams.get("category")

  const value = searchParams.get("sort");

  const fetchData = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  useEffect(() => {
    if (value) {
      setSort(value);
      if (routePath !== "/") {
        router.push("/");
      }
    } else {
      setSort(null);
    }
  }, [value, routePath, router]);

  // Fetch products
  useEffect(() => {
    // get searched products
    if (searchedProducts) {
      const fetchSearchedProducts = async () => {
        try {
          const response = await axios.get(`${API_URL}/get-searched-products?search=${searchedProducts}`);
          setProducts(response.data.data);
          setSearchResult(response.data.data.length);
          setError(null);
        } catch (err: unknown) {
          if (err instanceof AxiosError) {
            setError(err.message || "An error occurred while fetching products.");
          }
        }
      }
      fetchSearchedProducts();

    }
    const fetchProducts = async () => {
      try {
        const endpoint = sort ? `${API_URL}/${sort}` : `${API_URL}/get-products`;
        const response = await axios.get(endpoint);
        setProducts(response.data.data);
        setError(null);
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          setError(err.message || "An error occurred while fetching products.");
        }
      }
    };
    if (!searchedProducts) {

      fetchProducts();
    }
  }, [API_URL, sort, searchedProducts]);
  // Fetch all reviews
  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const res = await axios.get(`${API_URL}/get-all-reviews`);
        setReviews(res.data.data);
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.code === "ERR_NETWORK") {
          return;
        }
      }
    };
    fetchAllReviews();
  }, [API_URL, setReviews]);

  // fetch category base products 
  useEffect(() => {
    const categoryBaseProducts = async () => {
      try {
        const res = await axios.post(`${API_URL}/find-Category-Products?category=${categoryName}`)
        setProducts(res.data.data)

      } catch (error: unknown) {
        if (error) {
          return null
        }
      }
    }
    if (categoryName) {
      categoryBaseProducts()
    }
  }, [API_URL, categoryName])

  // Calculate average rating for each product
  const getAverageRating = (productId: string) => {
    const productReviews = reviews.filter(review => review.product === productId);
    if (productReviews.length === 0) return "0";

    const sum = productReviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / productReviews.length).toFixed(1);
  };




  return (
    <div className="bg-gray-100 min-h-screen px-6 py-10">
    {loading && <Loading />}
    
    {searchedProducts && (
      <h1 className="text-gray-600 font-semibold mb-6 text-lg">
        {searchResult} items found for &quot;{searchedProducts}&quot;
      </h1>
    )}
  
    {error ? (
      <p className="text-red-500 text-center text-lg">{error}</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product: ProductTypes) => {
          const productId = product._id;
          const averageRating = parseFloat(getAverageRating(productId));
  
          return (
            <div
              key={product._id}
              onClick={() =>
                router.push(`/order?product=${product._id}&p=${product.price}&stock=${product.countInStock}&rating=${averageRating}`)
              }
              className="bg-white shadow-lg rounded-xl cursor-pointer overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl duration-300"
            >
              <Image
                className="w-full h-52 object-cover"
                src={product.image}
                alt={product.title}
                width={100}
                height={52}
              />
              <div className="p-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-1 truncate">{product.title}</h2>
                <p className="text-sm text-gray-500">{product.brand}</p>
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">{product.description}</p>
  
                <div className="flex justify-between items-center mt-4">
                  <span className="text-lg font-bold text-green-600">${product.price}</span>
                  {product.countInStock > 0 ? (
                    <span className="text-sm font-medium text-green-500">In Stock</span>
                  ) : (
                    <span className="text-sm font-medium text-red-500">Out of Stock</span>
                  )}
                </div>
  
                {/* Star Rating Display */}
                <div className="flex items-center justify-center space-x-1 mt-3">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span
                      key={index}
                      className={`text-xl ${index < Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"}`}
                    >
                      {index < Math.round(averageRating) ? "★" : "☆"}
                    </span>
                  ))}
                  <span className="text-gray-700 text-sm ml-1">({averageRating})</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
  
  );
};

export default Products;
