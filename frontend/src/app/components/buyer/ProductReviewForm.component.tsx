"use client";
import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";


const ProductReviewFormComponent = ({
    productId,
}: {

    productId: string | null;
}) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const [reviewMessage, setReviewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [rating, setRating] = useState(1);
    const ratingOptions = [1, 2, 3, 4, 5];
    const router = useRouter()

    const handleSubmit = async () => {
        if (!productId) {
            alert("Product not found. Return to home page and try again.");
            return;
        }
        if (reviewMessage.trim() === "") {
            return setError("Review message cannot be empty.");

        }
        if (rating < 1 || rating > 5) {
            setError("Rating must be between 1 and 5.");
            return;
        }
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await axios.post(
                `${API_URL}/review/${productId}`,
                { rating, reviewMessage },
                { withCredentials: true }
            );
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
            }, 2000);
            setReviewMessage("");
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                if (err.response?.status === 401) {
                    router.push('/login')
                }
                setError(`Failed to submit review:${err.response?.data.error || 'Unknown error'}`);
            }

            setTimeout(() => {
                setError(null);

            }, 2000);
        } finally {
            setLoading(false);
            setError(null);
            setSuccess(false);


        }
    };

    return (
        <div
            className={`${!productId && "hidden"}  rounded-lg`}
        >
            <h2 className="text-lg font-semibold text-gray-400 mb-2">
                Write a Review
            </h2>

            {success && (
                <p className="text-green-500">Review submitted successfully!</p>
            )}

            {productId ? (
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Rating
                    </label>
                    <div className="flex space-x-1 mt-1">
                        {ratingOptions.map((num) => (
                            <span
                                key={num}
                                className={`cursor-pointer text-xl ${num <= rating ? "text-yellow-500" : "text-gray-300"
                                    }`}
                                onClick={() => setRating(num)}
                            >
                                ★
                            </span>
                        ))}
                    </div>

                    <label className="block text-sm font-medium text-gray-700 mt-3">
                        Review
                    </label>
                    <textarea
                        className="w-full  p-2 border text-gray-600 rounded mt-1 overflow-y-auto resize-none"
                        rows={3}
                        value={reviewMessage}
                        onChange={(e) => setReviewMessage(e.target.value)}
                        placeholder="Write your review here..."

                    />

                    <div className="flex flex-col items-center">
                        {error && <p className="text-red-500">{error}</p>}

                        <button
                            onClick={handleSubmit}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded mt-3"
                            disabled={loading}
                        >
                            {loading ? "Submitting..." : "Submit Review"}
                        </button>
                    </div>
                </div>
            ) : (
                <Link
                    className="w-full hover:text-gray-500 text-gray-600 font-semibold underline py-2 px-4 rounded mt-3"
                    href="/"
                >
                    Return to Home Page↗
                </Link>
            )}
        </div>
    );
};

export default ProductReviewFormComponent;
