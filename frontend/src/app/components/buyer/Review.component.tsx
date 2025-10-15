"use client"
import React, { useEffect, useState } from 'react'
import { ReviewsInterface } from '../../utils/review.interface'
import axios, { AxiosError } from 'axios';
const ReviewComponent = ({ productId }: { productId: string | null }) => {
    const [reviews, setReviews] = useState<ReviewsInterface[]>([])
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    // fetchSingleProductReviews
    useEffect(() => {
        const fetchSingleProductReviews = async () => {
            try {
                const res = await axios.get(`${API_URL}/get-all-reviews`);
                const filterProduct = res.data.data.filter((product: { product: string }) => product.product === productId)
                setReviews(filterProduct);
            } catch (error: unknown) {
                if (error instanceof AxiosError && error.code === "ERR_NETWORK") {
                    return;
                }
            }
        };
        if (!productId) {
            return alert('Product id is missing!')
        }
        fetchSingleProductReviews();

    }, [API_URL, setReviews, productId]);


    return (
        <div  className=' w-full max-w-lg'>
            {
                reviews.length === 0 &&
                <div className='w-full flex  items-center justify-center p-10'>

                    <h2  className='text-gray-400'>no reviews</h2>
                </div>
            }
            {reviews && reviews.length > 0 && (
                <div className="space-y-6 ">
                    {reviews.map((review, index) => (
                        <div
                            key={index}
                            className="bg-white shadow-md rounded-lg p-5 border border-gray-200"
                        >
                            {/* Star Rating */}
                            <div className="flex items-center space-x-1 mb-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <span
                                        key={i}
                                        className={`text-2xl ${i < Math.round(review.rating) ? "text-yellow-400" : "text-gray-300"
                                            }`}
                                    >
                                        {i < Math.round(review.rating) ? "★" : "☆"}
                                    </span>
                                ))}
                            </div>

                            {/* User Name */}
                            <h2 className="text-lg font-semibold text-gray-800">
                                {review.user ? review.user.fullName : "Anonymous"}
                            </h2>

                            {/* Review Message */}
                            <p className="text-gray-600 text-sm mt-1">{review.reviewMessage}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ReviewComponent
