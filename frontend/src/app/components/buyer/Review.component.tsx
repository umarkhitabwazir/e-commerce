"use client"
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { ReviewsInterface } from '../../utils/review.interface'
import axios, { AxiosError } from 'axios';
import useAuth from '@/app/auths/auth';
import { formatDate } from '../FormatDate.component';
import ProductReviewEditFormComponent from '../ProductReviewEditForm.component';


const ReviewComponent = ({ setCountReviews, productId }: { setCountReviews: Dispatch<SetStateAction<{ [key: string]: number }>>, productId: string | null }) => {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<ReviewsInterface[]>([])
  const [editData, setEditData] = useState<ReviewsInterface | null>(null);
  const [editToggle, setEditToggle] = useState<boolean>(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;



  useEffect(() => {
    if (!productId) {
      return;
    }
    // fetchReviews
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${API_URL}/get-all-reviews`);
        const filtered = res.data.data.filter(
          (review: { product: string }) => review.product === productId
        );
        setReviews(filtered);
        setCountReviews(prev => ({ ...prev, [productId]: filtered.length }));

      } catch (error: unknown) {
        if (error instanceof AxiosError && error.code === "ERR_NETWORK") {
          return;
        }
      }
    };

    fetchReviews();

  }, []);
  const handleEditToggle = async (review: ReviewsInterface) => {
    setEditData(review);
    setEditToggle(true);
  }

  const handleDelete = async (reviewId: string) => {
    try {
      await axios.delete(`${API_URL}/delete/${reviewId}`, { withCredentials: true });
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        alert("Failed to delete review: " + (error.response?.data.error || "Unknown error"));
        return;
      }
    }
  }

  

  return (
    <>
      <div className="flex items-center bg-blue-500 rounded-t-md p-2 justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Customer Reviews</h2>
        <span className="text-sm text-gray-500 bg-gray-100 md:px-3 px-1 py-1 rounded-full">
          {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
        </span>
      </div>
      <div className={`w-full max-w-2xl   p-4   ${reviews.length !== 0 && 'h-1/2 overflow-y-scroll'}`}>
        {reviews.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h2 className="text-gray-500 font-medium text-lg mb-2">No Reviews Yet</h2>
            <p className="text-gray-400 text-sm max-w-sm">
              Be the first to share your experience with this product.
            </p>
          </div>
        ) : (
          <div className="space-y-4 ">
            {reviews.map((review, index) => (
              <div
                key={review._id || index}
                className="bg-white rounded-xl border  border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 p-6"
              >
                {/* Header with user info and rating */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {review.user?.username?.charAt(0)?.toUpperCase() || 'A'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {review.user ?
                          (review.user.username === user?.username ?
                            "You" :
                            review.user.username
                          ) :
                          "Anonymous"
                        }
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {formatDate(review.updatedAt.toString())}
                      </p>
                    </div>
                  </div>

                  {/* Rating badge */}
                  <div className="flex items-center space-x-1 bg-blue-50 px-3 py-1 rounded-full">
                    <span className="text-yellow-500 text-lg">★</span>
                    <span className="text-blue-800 font-medium text-sm">
                      {review.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Star Rating */}
                <div className="flex items-center space-x-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-xl ${star <= review.rating
                        ? "text-yellow-500"
                        : "text-gray-300"
                        }`}
                    >
                      ★
                    </span>
                  ))}
                </div>

                {/* Review Message */}
                <p className="text-gray-700 leading-relaxed text-[15px]">
                  {review.reviewMessage}
                </p>
                {
                  user?._id === review.user._id
                  &&
                  <div
                    className='flex justify-end gap-4 mt-4'
                  >
                    {/* Actions */}
                    <button
                      onClick={() => {
                        review._id &&
                          handleEditToggle(review)
                      }
                      }
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                      Edit
                    </button>
                    <button 
                      onClick={() => {
                        review._id &&
                          handleDelete(review._id)
                      }}                      
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
                      Delete
                    </button>

                  </div>
                }

              </div>
            ))}
            {
              // Edit form 
              editToggle && editData && (
                <ProductReviewEditFormComponent
                  editData={editData}
                  setEditData={setEditData}
                  setEditToggle={setEditToggle}
                  setReviews={setReviews}
                />
              )
            }
          </div>
        )}
      </div>
    </>
  )
}

export default ReviewComponent
