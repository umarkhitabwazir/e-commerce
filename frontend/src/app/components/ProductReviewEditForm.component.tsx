import React, { useEffect, useState } from 'react'
import { ReviewsInterface } from '../utils/review.interface';
import axios, { AxiosError } from 'axios';

const ProductReviewEditFormComponent = (
  {
    editData,
    setEditData,
    setEditToggle,
     setReviews}
  : {
    editData: ReviewsInterface | null;
    setEditData: React.Dispatch<React.SetStateAction<ReviewsInterface | null>>;
    setEditToggle: React.Dispatch<React.SetStateAction<boolean>>;
    setReviews: React.Dispatch<React.SetStateAction<ReviewsInterface[]>>;
  }
) => {
    const [rating, setRating] = useState(1);
    const ratingOptions = [1, 2, 3, 4, 5];
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

useEffect(() => {
    if (editData) {
        setRating(editData.rating);
    }
}, [editData]);
const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  
  if (!editData) return alert("No review data to edit");

  try {
    const res = await axios.patch(
      `${API_URL}/update/${editData._id}`,
      {
        rating,
        reviewMessage: editData.reviewMessage,
      },
      { withCredentials: true }
    );

    // Update review list instantly
    setReviews((prev) =>
      prev.map((r) => (r._id === editData._id ? { ...r, ...res.data.data } : r))
    );

    // setEditToggle(false);
    setEditData(null);
  } catch (error:unknown) {
    if (error instanceof AxiosError) {
      alert("Failed to edit review: " + (error.response?.data.message || "Unknown error"));
      return;
    }
  }
};
  return (
 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-full max-w-md">
                    <h2 className="text-xl font-semibold text-black mb-4">Edit Your Review</h2>
                    <form onSubmit={handleEditSubmit}>
                      <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Rating</label>
                      
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
              {editData &&        <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Review Message</label>
                        <textarea
                          value={editData.reviewMessage}
                          required
                          onChange={(e) =>
                            setEditData({ ...editData, reviewMessage: e.target.value })
                          }
                          className="w-full border text-black border-gray-300 rounded px-3 py-2"
                          rows={4}
                          placeholder='Write your review here...' 
                        ></textarea>
                      </div>}
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setEditToggle(false)}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
  )
}

export default ProductReviewEditFormComponent
