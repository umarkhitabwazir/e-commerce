'use client';

import { useState, Dispatch, SetStateAction, useRef } from 'react';
import axios, { AxiosError } from 'axios';
import { ProductInterface } from '../utils/productsInterface';
import Image from 'next/image';



const EditProductComponent = ({ refresh, setEditProductId, product }: { refresh: Dispatch<SetStateAction<ProductInterface[]>>, setEditProductId: Dispatch<SetStateAction<string | ''>>, product: ProductInterface | null }) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [formData, setFormData] = useState({
    categoryName: product?.category.categoryName || '',
    title: product?.title || '',
    price: product?.price || 0,
    description: product?.description || '',
    countInStock: product?.countInStock || 0,
    brand: product?.brand || '',
  });

  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | ''>('')
  const [loading, setLoading] = useState(false);
  const editBtnRef = useRef<HTMLButtonElement | null>(null);


  const onClose = () => {
    setEditProductId('')
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      setImage(file);
    }
  };

  const editProduct = async () => {
    if (!product) return;
    setLoading(true);
    try {
      const data = new FormData();
      data.append('categoryName', formData.categoryName);
      data.append('title', formData.title);
      data.append('price', formData.price.toString());
      data.append('description', formData.description);
      data.append('countInStock', formData.countInStock.toString());
      data.append('brand', formData.brand);
      if (image) data.append('productImg', image);

      const res = await axios.patch(`${API_URL}/product/update/${product._id}`, data, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setEditProductId('')


      console.log('res', res.data.data)
      refresh((prev) => prev) // or fetch updated products and pass them here
    } catch (error: unknown) {
      setLoading(false);
      if (error instanceof AxiosError) {
        setError(error.message)
        console.log('Update failed:', error.response);
      }

      ;
    } finally {

      setLoading(false);
    }
  };

  return (
    <div
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          editBtnRef.current?.scrollIntoView({ behavior: 'smooth' });

          editProduct()
          console.log('clicked enter')
        }
      }} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="relative bg-white w-full max-w-md p-6 rounded-lg shadow-xl overflow-y-auto max-h-[90vh]">

        {/* ❌ Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Edit Product</h2>
        <div className="space-y-4">
          <input
            type="text"
            name="categoryName"
            value={formData.categoryName}
            onChange={handleChange}
            placeholder="Category Name"
            className="w-full p-2 border border-gray-300 rounded text-black"
          />
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full p-2 border border-gray-300 rounded text-black"
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full p-2 border border-gray-300 rounded text-black"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-2 border border-gray-300 rounded h-24 text-black resize-none"
          />
          <input
            type="number"
            name="countInStock"
            value={formData.countInStock}
            onChange={handleChange}
            placeholder="Stock Count"
            className="w-full p-2 border border-gray-300 rounded text-black"
          />
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="Brand"
            className="w-full p-2 border border-gray-300 rounded text-black"
          />

          {/* Image + File Input */}
          <div className="relative w-full h-60 border border-gray-300 rounded overflow-hidden">
            {product?.image && (
              <Image
                src={previewUrl ? previewUrl : product?.image}
                width={300}
                height={300}
                alt="Product image"
                className="object-contain w-full h-full"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
          {
            error &&
            <p className='text-red-500 text-sm'>{error}</p>
          }

          <button
            ref={editBtnRef}
            onClick={editProduct}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? 'Updating...' : 'Update Product'}
          </button>
        </div>
      </div>
    </div>


  );
};

export default EditProductComponent;
