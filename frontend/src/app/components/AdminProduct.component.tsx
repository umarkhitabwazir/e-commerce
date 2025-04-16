"use client";

import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import withAuth from "../utils/withAuth";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Product {
  _id: string;
  title: string;
  price: number;
  brand: string,
  countInStock: number,
  description: string;
  image: string;
  createdAt: Date
}

const AdminProductComponent = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    const getAdminProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin-products`, {
          withCredentials: true,
        });
        console.log("Products fetched successfully", res.data);
        setProducts(res.data.data || []);
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {

            return router.push("/");
          }
        }
      }
    };
    getAdminProducts();
  }, [API_URL, router, setProducts]);

  const handleEdit = (productId: string) => {
    router.push(`/edit-product?product=${productId}`);
  };

  const handleDelete = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`${API_URL}/product/delete/${productId}`, {
          withCredentials: true,
        });
        setProducts(products.filter((product: { _id: string }) => product._id !== productId));
        alert("Product deleted successfully.");
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
console.log(error)
          alert("Failed to delete product. Please try again.");
        }
      }
    }
  };

  return (
    <div className="  bg-gray-100">
      <div className="flex justify-center flex-wrap items-center">
        <h1 className="font-bold max-sm:font-medium text-blue-600 mb-6">
          Admin Products Dashboard
        </h1>
      </div>

      {products.length === 0 ? (
        <div className="text-gray-600 text-center text-lg mt-8">
          No products found. Add new products to see them here.
        </div>
      ) : (
        <div className="flex flex-wrap gap-6">
          {products.map((product: Product) => (
            <div
              key={product._id}
              className="border  rounded-lg p-5 shadow-lg bg-white hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              <Image
                src={product.image}
                alt={product.title}
                className="w-50 h-50 object-cover mb-4 rounded-lg"
                width={100}
                height={100}
              />
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {product.title}
              </h2>
              <p className="text-gray-600 mb-2 text-sm line-clamp-2">
                {product.description}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Price:</span> ${product.price}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Brand:</span> {product.brand}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Stock:</span> {product.countInStock}
              </p>
              <p className="text-gray-500 text-sm mt-3">
                <span className="font-semibold">Created At:</span>{" "}
                {new Date(product.createdAt).toLocaleDateString()}
              </p>
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => handleEdit(product._id)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring focus:ring-yellow-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default withAuth(AdminProductComponent);
