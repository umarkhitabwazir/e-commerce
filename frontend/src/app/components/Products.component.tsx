"use client";

import React, { useCallback, useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { ProductInterface } from '../utils/productsInterface';
import Loading from './Loading.component';
import AddToCartComponent from './AddToCart.component';
import FavInterface from '../utils/favInterface';

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
  const params = new URLSearchParams(searchParams.toString());

  const searchedProducts = searchParams.get("search")
  const categoryName = searchParams.get("category")
  const [showAddTocart, setShowAddTocart] = useState<boolean>(false)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [favProductsIds, setFavProductsIds] = useState<string[]>([])
  const value = searchParams.get("sort");
  const favIdInParams = searchParams.get("favId");

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

  const fetchProducts = async () => {
    try {
      const endpoint = await sort ? `${API_URL}/${sort}` : `${API_URL}/get-products`;
      const response = await axios.get(endpoint);
      setProducts(response.data.data);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.message || "An error occurred while fetching products.");
      }
    }
  };
  const fetchSearchedProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/search-products?search=${searchedProducts}`);
         setProducts(response.data.data);
      setSearchResult(response.data.data.length);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.message || "An error occurred while fetching products.");
      }
    }
  }
  // Fetch products
  useEffect(() => {
    // get searched products
    if (searchedProducts) {
      fetchSearchedProducts();
    }

if (!searchedProducts && !categoryName){

  fetchProducts();
}

  }, [API_URL, sort, searchedProducts]);
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
  // Fetch all reviews
  useEffect(() => {
    fetchAllReviews();
  }, [API_URL, setReviews]);

  // get FavouriteProducts
  const getFavProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/get-fav-product`, { withCredentials: true })

      const productIds = res.data.data.map((fav: FavInterface) => fav.item._id)
      setFavProductsIds(productIds)

    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.log('fav product error', error)
      }
    }
  }
  useEffect(() => {
    getFavProducts()
  }, [])
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
  // fetch category base products 
  useEffect(() => {
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

  const addToFavHandler = async (productId: string) => {

    try {
      await axios.post(`${API_URL}/add-to-fav/${productId}`, {}, { withCredentials: true })
      if (favIdInParams) {
        alert('✅product added to favorite successfully')
      }
      fetchProducts()
      getFavProducts()
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.data.error === 'Unauthorized') {
          router.push(`/login?favId=${productId}`)
          console.log('addToFavHandler error', error.response)
        }
      }
    }
  }
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
  useEffect(() => {
    if (favIdInParams) {

      addToFavHandler(favIdInParams)
      setTimeout(() => {

        params.delete("favId");
        router.replace(`?${params.toString()}`);
      }, 3000)
    }
  }, [favIdInParams])
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
        <div className="grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: ProductInterface) => {
            const productId = product._id;
            const averageRating = parseFloat(getAverageRating(productId));
            const isOutOfStock = product.countInStock <= 0;

            return (
              <div
                key={product._id}

                className="group relative bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-gray-200"
              >
                {isOutOfStock && (
                  <div className="absolute top-4 right-4 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                    OUT OF STOCK
                  </div>
                )}

                {/* Product Image */}
                <div
                  onClick={() =>
                    router.push(`/order?product=${product._id}&p=${product.price}&stock=${product.countInStock}&rating=${averageRating}`)
                  } className="relative pt-[75%] overflow-hidden">
                  <Image
                    className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    src={product.image}
                    alt={product.title}
                    width={400}
                    height={300}
                  />
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                        {product.title}
                      </h2>
                      <p className="text-sm text-gray-500">{product.brand}</p>
                    </div>
                    <span className={`text-xl font-bold ${isOutOfStock ? 'text-gray-400' : 'text-emerald-600'}`}>
                      ${product.price}
                    </span>
                  </div>

                  <p className="mt-3 text-gray-600 text-sm line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Rating and Stock */}
                  <div className="mt-4 flex flex-col gap-2">
                    <div className="flex items-center">
                      <div className="flex mr-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`text-lg ${star <= Math.round(averageRating) ? "text-amber-400" : "text-gray-300"}`}
                          >
                            ★
                          </span>
                        ))}

                      </div>

                      <span className="text-gray-700 text-sm font-medium">
                        ({averageRating.toFixed(1)})
                      </span>
                    </div>
                    {
                      favProductsIds.includes(product._id)
                        ?
                        <button
                          onClick={() => removeFavHandler(product._id)}

                         className="text-red-500 hover:text-red-700">

                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>


                        </button>
                        :

                        <button
                          onClick={() => addToFavHandler(product._id)}
                          className="text-red-500 hover:text-red-700">

                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>

                        </button>
                    }

                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${isOutOfStock ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                        <span className={`text-sm font-medium ${isOutOfStock ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {isOutOfStock ? 'Out of Stock' : `${product.countInStock} Available`}
                        </span>
                      </div>
                      <button
                        className="text-sm relative z-70  font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                        onClick={() => {
                          setSelectedProductId(product._id)
                          setShowAddTocart((prev) => !prev)
                        }}
                      >
                        + Quick Add
                      </button>
                    </div>
                  </div>
                </div>
                {
                  showAddTocart && selectedProductId === product._id &&
                  <div className='z-70'>

                    <AddToCartComponent product={product} setShowAddTocart={setShowAddTocart} />
                  </div>
                }

              </div>
            );
          })}
        </div>
      )}
    </div>

  );
};

export default Products;
