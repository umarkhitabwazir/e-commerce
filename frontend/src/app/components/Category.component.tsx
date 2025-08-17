'use client'
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

type Category = {
    _id: string;
    categoryName: string;
};

const CategoryComponent = () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const [category, setCategory] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await axios.get(`${API_URL}/all-category-list`);
                setCategory(res.data.data || []);
                console.log('category-copm', res.data.data)
            } catch (error: unknown) {
                if (error instanceof AxiosError) {

                    setError(error.response?.data?.message || 'Failed to load categories');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchCategory();
    }, [API_URL]);

    return (
        <div className="absolute z-10 w-64 rounded-lg shadow-xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700">
            <div className="p-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-white flex items-center">
                    <span className="mr-2">📋</span> Product Categories
                </h2>
            </div>

            <div className="max-h-60 overflow-y-auto custom-scrollbar">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-3"></div>
                        <p className="text-gray-400">Loading categories...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center p-4 text-center">
                        <span className="text-3xl mb-2">⚠️</span>
                        <p className="text-red-400 mb-2">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-2 px-4 py-1.5 text-sm rounded-md bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                ) : category.length === 0 ? (
                    <div className="flex flex-col items-center p-6">
                        <span className="text-4xl mb-3">📭</span>
                        <p className="text-gray-400 text-center">No categories found</p>
                        <p className="text-gray-500 text-sm mt-1 text-center">Add categories to see them listed here</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-800">
                        {category.map((cat) => (
                            <div
                                key={cat._id}
                                className="px-4 py-3 hover:bg-gray-800/60 cursor-pointer transition-all duration-200 group"
                                onClick={() => router.push(`/?category=${encodeURIComponent(cat.categoryName)}`)}
                            >
                                <div className="flex items-center">
                                    <div className="mr-3 group-hover:scale-110 transition-transform">
                                        <div className="bg-gray-800 border border-gray-700 rounded-lg w-8 h-8 flex items-center justify-center">
                                            <span className="text-gray-400 group-hover:text-white">&#8594;</span>
                                        </div>
                                    </div>
                                    <h3 className="text-gray-300 group-hover:text-white font-medium truncate transition-colors">
                                        {cat.categoryName}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryComponent;