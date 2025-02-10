"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import withAuth from "../utils/withAuth";
import { useRouter } from "next/navigation";
import Image from "next/image";

const AdminProductComponent = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [products, setProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const getAdminProducts = async () => {
      try {
        let res = await axios.get(`${API_URL}/admin-products`, {
          withCredentials: true,
        });
        console.log("Products fetched successfully", res.data);
        setProducts(res.data.data || []);
      } catch (error: any) {
        if (error.response?.status === 401) {
          return router.push("/");
        }
        console.log("Error fetching admin products:", error.response);
      }
    };
    getAdminProducts();
  }, [API_URL]);

  const handleEdit = (productId: string) => {
    router.push(`/edit-product?product=${productId}`);
  };

  const handleDelete = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`${API_URL}/admin-products/${productId}`, {
          withCredentials: true,
        });
        setProducts(products.filter((product: any) => product._id !== productId));
        alert("Product deleted successfully.");
      } catch (error: any) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product. Please try again.");
      }
    }
  };

  return (
    <div className="absolute w-4/5 max-sm:w-1/2 max-sm:p-10 max-md:w-3/5  right-5 p-6 bg-gray-100">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: any) => (
            <div
              key={product._id}
              className="border rounded-lg p-5 shadow-lg bg-white hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              <Image
                src={product.image}
                alt={product.title}
                className="w-full h-48 object-cover mb-4 rounded-lg"
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
