import { Review } from "../models/Review.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const reviewController = asyncHandler(async (req, res) => {
    const  { rating, reviewMessage } = req.body;
    const user = req.user
    if (!user) {
        res.status(400).json({ message: "user must be logined in!" });
    }
    const productId = req.params.productId
    if (!productId) {
        throw new ApiError(400, "product Id not found")
    }

    if (!rating || !reviewMessage) {
        res.status(400).json({ message: "All fields are required" });
    }
    if (rating < 1 || rating > 5) {
        throw new ApiError(400, "Rating must be between 1 and 5!");
    }
    const review = await Review.create({
        user: user.id,
        product: productId,
        rating,
        reviewMessage,
    });
    res.status(200).json(
        new ApiResponse(201, review, "Review created successfully")
    )
});
const getAllReviews = asyncHandler(async (req, res) => {  
    
    const reviews = await Review.find().populate("user","fullName");

    res.status(200).json(new ApiResponse(200, reviews, "All reviews fetched successfully"));
});

const updateReview = asyncHandler(async (req, res) => {
    const  { rating, reviewMessage } = req.body;
    const user = req.user

    if (!user) {
        throw new ApiError(400, "user not logined! ")
    }
    const productId = req.params.productId
    
    if (!productId) {
        throw new ApiError(400, "product Id not found ")

    }

    if (!rating, !reviewMessage) {
        throw new ApiError(400, "all fields are required! ")

    }
    if (rating < 1 || rating > 5) {
        throw new ApiError(400, "Rating must be between 1 and 5!");
    }

    const  review = await Review.findOneAndUpdate(
        { product: productId, user: user.id },
        { rating, reviewMessage },
        { new: true }
    );

    if (!review) throw new ApiError(404, "Review not found!");




    res.status(200).json({ status: "success", data: review, message: "Review updated successfully" });

})
const deleteReview = asyncHandler(async (req, res) => {
    const productId = req.params.productId
    if (!productId) {
        throw new ApiError(400, "prodiuct Id is not found!")
    }
    const review = await Review.findOne({ product: productId })
    if (!review) {
        throw new ApiError(400, "review is not found!")

    }
    await review.deleteOne()
    res.status(200).send()
})

export {
    reviewController,
    getAllReviews,
    updateReview,
    deleteReview
};