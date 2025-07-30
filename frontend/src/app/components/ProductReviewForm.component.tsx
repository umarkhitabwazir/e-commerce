"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { UserInterface } from "../utils/user.interface";
import SingleProductComponent from "./SingleProduct.component";
import adminAuth from "../utils/adminAuth";

const ProductReviewComponent = ({ user, productId }: { user: UserInterface, productId: string | null }) => {
    useEffect(() => {
        if (!user) {
            return;
        }


    }, [user])
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const [rating, setRating] = useState(1);
    const [reviewMessage, setReviewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        if (!productId) {
            return alert("Product not found return to home page and try again");


        }
        e.preventDefault();
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
            setReviewMessage("");

        } catch (err) {
            console.error(err);
            // setError("Failed to submit review. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-lg font-semibold text-gray-400 mb-2">Write a Review</h2>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">Review submitted successfully!</p>}
            <SingleProductComponent productId={productId} />
            <form onSubmit={handleSubmit}>
                {/* Star Rating Input */}
                <label className="block text-sm font-medium text-gray-700">Rating</label>
                <div className="flex space-x-1 mt-1">
                    {[1, 2, 3, 4, 5].map((num) => (
                        <span
                            key={num}
                            className={`cursor-pointer text-xl ${num <= rating ? "text-yellow-500" : "text-gray-300"}`}
                            onClick={() => setRating(num)}
                        >
                            ★
                        </span>
                    ))}
                </div>

                {/* Review Message Input */}
                <label className="block text-sm font-medium text-gray-700 mt-3">Review</label>
                <textarea
                    className="w-full p-2 border text-gray-600 rounded mt-1"
                    rows={3}
                    value={reviewMessage}
                    onChange={(e) => setReviewMessage(e.target.value)}
                    placeholder="Write your review here..."
                    required
                />

                {/* Submit Button */}
                <div className="flex flex-col items-center">
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mt-3"
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Submit Review"}
                    </button>
                    {
                        !productId &&
                        <Link
                            className="w-full  hover:text-gray-500 text-gray-600 font-semibold underline py-2 px-4 rounded mt-3"
                            href="/"
                        >
                            Return to Home Page↗
                        </Link>
                    }
                </div>
            </form>
        </div>
    );
};

export default adminAuth(ProductReviewComponent)
