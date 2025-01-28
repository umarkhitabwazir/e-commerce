"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { usePathname, useSearchParams } from 'next/navigation';

const Products = () => {
  const [sort, setSort] = useState<string | null>(null); // Sort state
  const [products, setProducts] = useState([]); // Product data state
  const [error, setError] = useState<string | null>(null); // Error state
  const router = useRouter()
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const LOCAL_HOST = process.env.NEXT_PUBLIC_LOCAL_HOST;
  const isSuperAdmin = ["superadmin", "admin"]
  const routePath = usePathname()
  const isrole = isSuperAdmin.includes(routePath)
  const routes = ["/"]
  const productPath = routes.includes(routePath)
  let searchParams = useSearchParams()
  let value = searchParams.get("sort")



  let [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {

        await new Promise((resolve) => setTimeout(resolve, 2000));

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
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
      console.error('Error  searchParams:', err);
      setSort(null); // Clear sort in case of invalid JSON
    }

  }, [searchParams]);

  // Fetch products based on the `sort` state
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const endpoint = sort ? `${API_URL}/${sort}` : `${API_URL}/get-products`;
        const response = await axios.get(endpoint);
        setProducts(response.data.data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching products:', err?.message);
        setError(err?.message || 'An error occurred while fetching products.');
      }
    };

    fetchProducts();
  }, [sort]); // Run whenever `sort` changes

  // productHandlers
  let productHandlers = (product: { _id: string, price: number, countInStock: number }) => {
    setLoading(true)
    router.push(`${LOCAL_HOST}/order?product=${product._id}&p=${product.price}&stock=${product.countInStock}`)
  }

  return (
    <div className="bg-bgGray min-h-screen   p-10">

      {error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : loading ? <div></div>
        : (
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
                  <img
                    className="w-full h-48 object-cover"
                    src={product.image}
                    alt={product.title}
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
                  </div>
                </div>
              )
            )}
          </div>
        )}
    </div>
  );
};

export default Products;
