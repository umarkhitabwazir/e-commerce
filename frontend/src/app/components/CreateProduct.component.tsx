"use client"
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CreateProductSchema, CreateProductFormData } from '../utils/formSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import withAuth from '../utils/withAuth';
import { useRouter } from 'next/navigation';

// Zod schema validation


const  CreateProductComponent = () => {
    const  API_URL = process.env.NEXT_PUBLIC_API_URL;
    const  [error, setError] = useState("")
    const  [message, setMessage] = useState("")
    const  [loading, setLoading] = useState(false)
    const  router=useRouter()

    const  {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateProductFormData>({
        resolver: zodResolver(CreateProductSchema),
    });

    const  onSubmit = async (data: CreateProductFormData) => {
        console.log(data);
        setLoading(true)
        const formData = new FormData()
        formData.append('productImg', data.productImg[0]);
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('price', data.price.toString());
        formData.append('brand', data.brand);
        formData.append('countInStock', data.countInStock.toString());
        formData.append('categoryName', data.categoryName);

        console.log(formData)
        try {
            const res = await axios.post(`${API_URL}/product/create`, formData, { withCredentials: true })
            console.log('res', res.data.message)
            setMessage(res.data.message)
            setTimeout(() => { setMessage("") }, 2000)
            setLoading(false)
            router.push('/my-products')
        } catch (error: unknown) {
                        setLoading(false)

            if (error instanceof AxiosError) {

                setError(error.response?.data.error)
                console.log("creatProductError", error)
            }
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-gray-300  text-black relative rounded-md">
            <h2 className="text-2xl font-bold text-center mb-6">Create Product</h2>
            <div className='flex justify-center items-center'>
                <span className={`${error && " text-red-500 text-sm" || message && "text-sm text-green-500"}`}>{error && error || message && message}</span>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 flex flex-wrap justify-between items-center p-4">
                {(['productImg', 'categoryName', 'title', 'price', 'description', 'countInStock', 'brand'] as Array<keyof CreateProductFormData>).map((field) => (
                    <div key={field} className="mb-4">
                        <label htmlFor={field} className="block font-semibold mb-2">
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                        </label>
                        <input
                            type={field === 'price' || field === 'countInStock' ? 'number' : field === 'productImg' ? 'file' : 'text'}
                            id={field}
                            accept="image/*"
                            {...register(field)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        />
                        <div>

                            {errors[field as keyof CreateProductFormData] && <span className="text-red-500 text-sm">{String(errors[field as keyof CreateProductFormData]?.message)}</span>}
                        </div>
                    </div>
                ))}
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white w-full rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                >
                    {loading ? "loading..." : "Create Product"}
                </button>

            </form>
        </div>
    );
};

export default withAuth(CreateProductComponent);
