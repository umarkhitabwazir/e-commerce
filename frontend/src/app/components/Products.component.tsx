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
  const LOCAL_HOST = process.env.NEXT_PUBLIC_LOCAL_HOST;
  const routePath = usePathname();
  const searchParams = useSearchParams();
  const searchedProducts = searchParams.get("search")

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

  // Calculate average rating for each product
  const getAverageRating = (productId: string) => {
    const productReviews = reviews.filter(review => review.product === productId);
    if (productReviews.length === 0) return "0";

    const sum = productReviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / productReviews.length).toFixed(1);
  };


 

  return (
    <div className="bg-bgGray min-h-screen p-10">
      {
        loading &&
        <Loading />
      }
      {
        searchedProducts &&
        <h1 className=' text-gray-400  font-semibold mb-4'>
          {searchResult}  items found for &quot;{searchedProducts}&quot;
        </h1>
      }

      {error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product: ProductTypes) => {
            const productId = product._id
            const averageRating = parseFloat(getAverageRating(productId));
            return (
              <div
                key={product._id}
                onClick={() => router.push(`${LOCAL_HOST}/order?product=${product._id}&p=${product.price}&stock=${product.countInStock}&rating=${averageRating}`)}
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

                  {/* Star Rating Display */}
                  <div className="flex items-center justify-center space-x-1 mt-2">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span key={index} className={` text-2xl ${index < Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"}`}>
                        {index < Math.round(averageRating) ? "★" : "☆"}
                      </span>
                    ))}
                    <span className="text-gray-700">({averageRating})</span>
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
