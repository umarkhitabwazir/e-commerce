"use client";

import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import withAuth from "../utils/withAuth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import EditProductComponent from "./EditProduct.component";
import { ProductInterface } from "../utils/productsInterface";



const AdminProductComponent = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [editProductId, setEditProductId] = useState<string | ''>("");
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const router = useRouter();

  const getAdminProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin-products`, {
        withCredentials: true,
      });
      console.log("Products fetched successfully", res.data);
      setProducts(res.data.data || []);
      setLoading(false)
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          setLoading(false)

          return router.push("/");
        }
      }
    }
  };
  useEffect(() => {
    getAdminProducts();
  }, [API_URL, router, setProducts]);





  const handleEdit = async (id: string) => {
    setEditProductId(id)
  };

  const handleDelete = (id: string) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = async () => {
    if (deleteConfirm) {
      try {
        await axios.delete(`${API_URL}/product/delete/${deleteConfirm}`, {
          withCredentials: true,
        });
        setProducts(products.filter((product: { _id: string }) =>  product._id !== deleteConfirm ));
        setDeleteConfirm(null)
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          console.log(error)
          setDeleteConfirm(null)


          alert("Failed to delete product. Please try again.");
        }
        setProducts(products.filter(p => p._id !== deleteConfirm));
        setDeleteConfirm(null);
      }
    };
  }
  const filteredProducts: ProductInterface[] = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case 'priceLowHigh':
        return a.price - b.price;
      case 'priceHighLow':
        return b.price - a.price;
      case 'stockLowHigh':
        return a.countInStock - b.countInStock;
      case 'stockHighLow':
        return b.countInStock - a.countInStock;
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      default:
        return 0;
    }
  });


  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Delete Product</h3>
              <p className="mt-2 text-gray-500">
                Are you sure you want to delete this product? This action cannot be undone.
              </p>
              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* edit form */}
      {
        editProductId &&
        <EditProductComponent
          refresh={getAdminProducts}
          setEditProductId={setEditProductId || ''}
          product={products.find(p => p._id === editProductId) || null}
        />
      }
      {/* Dashboard Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Products Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your product inventory efficiently</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => {
                  setSortOption('')
                  setSearchTerm(e.target.value)
                }}
                className="pl-10 pr-4 py-2 borde text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
              />
            </div>

            <select
              value={sortOption}
              onChange={(e) => {
                setSearchTerm('');

                setSortOption(e.target.value)
              }}
              className="px-4 py-2 border border-gray-300 bg-gray-500 cursor-pointer rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Newest First &#40;Default&#41;</option>
              <option value="oldest">Oldest First</option>
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
              <option value="stockLowHigh">Stock: Low to High</option>
              <option value="stockHighLow">Stock: High to Low</option>
            </select>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">Total Products</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{products.length}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">Low Stock Items</p>
            <p className="text-2xl font-bold text-orange-500 mt-1">
              {products.filter(p => p.countInStock <= 10).length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">Average Price</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              ${(products.reduce((sum, p) => sum + p.price, 0) / (products.length || 1)).toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">Total Inventory Value</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              ${products.reduce((sum, p) => sum + (p.price * p.countInStock), 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-t-blue-500 border-r-blue-700 border-b-indigo-700 border-l-violet-700 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : (searchTerm ? filteredProducts : products).length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">{searchTerm ? "No filtered Products found" : "No products found"}</h3>
            <p className={`${searchTerm ? 'hidden' : ''} text-gray-500 max-w-md mx-auto`}>
              Add new products to see them appear in your dashboard
            </p>
            <button onClick={() => router.push('create-product')}
              className={` ${searchTerm ? 'hidden' : ''} mt-6 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors`}>
              Add First Product
            </button>
          </div>
        ) : (
          <>
            {(searchTerm || sortOption !== 'newest') && (
              <div className="mt-6 mb-5 flex flex-col">
                <div className="flex items-end gap-2">
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 tracking-tight">
                    Results
                  </h3>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline gap-1.5">
                      <span className="text-gray-500 text-base font-medium">for</span>

                      <span className="text-blue-600 font-medium truncate max-w-[260px] md:max-w-md">
                        {searchTerm ? (
                          <>
                            <span className="text-blue-700 font-semibold">{searchTerm}</span>
                          </>
                        ) : sortOption === 'oldest' ? (
                          'Oldest First'
                        ) : (
                          <span className="capitalize">{sortOption}</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <hr className={` mt-3 w-12 h-1 bg-gradient-to-r  from-blue-500 to-indigo-600 rounded-full`} />
              </div>

            )}

          
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {(searchTerm ? filteredProducts : sortedProducts).map((product) => (
                <div
                  key={product._id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className=" " >
                          <Image src={product.image} width={120} height={120} alt="product img" />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-lg font-bold text-gray-900 truncate">
                          {product.title}
                        </h2>
                        <p className="text-gray-500 text-sm">{product.brand}</p>
                      </div>
                    </div>

                    <p className="mt-4 text-gray-600 text-sm line-clamp-2">
                      {product.description}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500">Price</p>
                        <p className="font-semibold">${product.price.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Stock</p>
                        <p className={`font-semibold ${product.countInStock <= 10 ? 'text-orange-500' : 'text-green-600'}`}>
                          {product.countInStock} {product.countInStock <= 10 && '(Low Stock)'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Created</p>
                        <p className="text-sm text-gray-600">
                          {new Date(product.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">ID</p>
                        <p className="text-sm text-gray-600 truncate">{product._id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 px-5 py-3 bg-gray-50">
                    <div className="flex justify-between gap-2">
                      <button
                        onClick={() => handleEdit(product._id)}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default withAuth(AdminProductComponent);
