"use client"
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CreateProductSchema, CreateProductFormData } from '../../utils/formSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';import sellerAuth from '../../auths/sellerAuth';


// Zod schema validation


const CreateProductComponent = () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateProductFormData>({
        resolver: zodResolver(CreateProductSchema),
    });
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };
    const onSubmit = async (data: CreateProductFormData) => {
        setLoading(true)
        const formData = new FormData()
        formData.append('productImg', data.productImg[0]);
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('price', data.price.toString());
        formData.append('brand', data.brand);
        formData.append('countInStock', data.countInStock.toString());
        formData.append('categoryName', data.categoryName);

       
        try {
            const res = await axios.post(`${API_URL}/product/create`, formData, { withCredentials: true })
          
            
            setMessage(res.data.message)
            setTimeout(() => { setMessage("") }, 2000)
            setLoading(false)
           reset()      
            setImagePreview(null)
            
           

            
        } catch (error: unknown) {
            setLoading(false)

            if (error instanceof AxiosError) {
console.log('add product error ',error)
                setError(error.response?.data.error)
            }
        }
    };

    return (
        <div className="w-screen  bg-white rounded-xl  shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
                <h2 className="text-2xl font-bold text-center text-white">Create New Product</h2>
            </div>

            <div className="p-6">
          

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {(['title', 'brand', 'price', 'countInStock', 'categoryName'] as Array<keyof CreateProductFormData>).map((field) => (
                            <div key={field} className="space-y-1">
                                <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                                    {field === 'countInStock' ? 'Stock Quantity' :
                                        field === 'categoryName' ? 'Category' :
                                            field.charAt(0).toUpperCase() + field.slice(1)}
                                </label>
                                {field === 'categoryName' ? (
                                    <select
                                        id={field}
                                        {...register(field)}
                                        className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        defaultValue=""
                                    >
                                        <option value="" disabled>
                                            Select a category
                                        </option>
                                        {CreateProductSchema.shape.categoryName.options.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={field === 'price' || field === 'countInStock' ? 'number' : 'text'}
                                        id={field}
                                        {...register(field)}
                                        className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                                    />
                                )}
                                {errors[field as keyof CreateProductFormData] && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {String(errors[field as keyof CreateProductFormData]?.message)}
                                    </p>
                                )}
                            </div>
                        ))}

                        {/* Description - Full Width */}
                        <div className="md:col-span-2 space-y-1">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                id="description"
                                {...register('description')}
                                rows={3}
                                className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Enter product description"
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {String(errors.description?.message)}
                                </p>
                            )}
                        </div>

                        {/* Image Upload with Preview */}
                        <div className="md:col-span-2 space-y-1 flex flex-col  gap-16">
                            <label htmlFor="productImg" className="block text-sm font-medium text-gray-700">
                                Product Image
                            </label>
                            <div className="flex flex-col items-center">
                                {/* Image Preview */}
                                {imagePreview ? (
                                    <div className="relative mb-4 border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="max-h-60 w-auto object-contain"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setImagePreview(null)}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                            aria-label="Remove image"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center relative w-full mt-8 mb-4">
                                        <label
                                            htmlFor="productImg"
                                            className="flex absolute flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors"
                                        >
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-10 w-10 text-gray-400"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                                <p className="mb-2 text-sm text-gray-500">
                                                    <span className="font-semibold">Click to upload</span>
                                                </p>
                                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                            </div>
                                        </label>

                                        <input
                                            id="productImg"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            {...register("productImg", {
                                                onChange: handleImageChange,
                                            })}
                                        />
                                    </div>

                                )}


                            </div>
                            {errors.productImg && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {String(errors.productImg?.message)}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="pt-10">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center disabled:opacity-70"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Product...
                                </>
                            ) : (
                                "Create Product"
                            )}
                        </button>
                    </div>
                </form>
                      {/* Status Messages */}
                <div className={`text-center mb-6 p-3 rounded-lg transition-all duration-300 ${error ? "bg-red-100 text-red-700" :
                    message ? "bg-green-100 text-green-700" :
                        "bg-transparent"
                    }`}>
                    {error && (
                        <div className="flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}
                    {message && (
                        <div className="flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>{message}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default sellerAuth(CreateProductComponent);
