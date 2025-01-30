import mongoose from "mongoose";
import { Review } from "../models/Review.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

let reviewController = asyncHandler(async (req, res) => {
    const { rating, reviewMessage } = req.body;
    let user = req.user
    if (!user) {
        res.status(400).json({ message: "user must be logined in!" });
    }
    let productId = req.params.productId
    if (!productId) {
        throw new ApiError(400, "product Id not found")
    }

    if (!rating || !reviewMessage) {
        res.status(400).json({ message: "All fields are required" });
    }
    if (rating < 1 || rating > 5) {
        throw new ApiError(400, "Rating must be between 1 and 5!");
    }
    let review = await Review.create({
        user: user.id,
        product: productId,
        rating,
        reviewMessage,
    });
    res.status(200).json(
        new ApiResponse(201, review, "Review created successfully")
    )
});
let getAllReviews = asyncHandler(async (req, res) => {  
    let productIdsArr = req.params.productIdsArr
    
    if (!productIdsArr || Array.isArray(productIdsArr) || productIdsArr.length === 0) {
        throw new ApiError(404, "product Id not found")
    }
    let idsArr=productIdsArr.split(",")
    let objectIds =idsArr.map(id => new mongoose.Types.ObjectId(id));

  
    let reviews = await Review.find({ product: { $in: objectIds } }).populate("user", "fullName email");

    res.status(200).json(new ApiResponse(200, reviews, "All reviews fetched successfully"));
});

let updateReview = asyncHandler(async (req, res) => {
    const { rating, reviewMessage } = req.body;
    let user = req.user

    if (!user) {
        throw new ApiError(400, "user not logined! ")
    }
    let productId = req.params.productId
    
    if (!productId) {
        throw new ApiError(400, "product Id not found ")

    }

    if (!rating, !reviewMessage) {
        throw new ApiError(400, "all fields are required! ")

    }
    if (rating < 1 || rating > 5) {
        throw new ApiError(400, "Rating must be between 1 and 5!");
    }

    const review = await Review.findOneAndUpdate(
        { product: productId, user: user.id },
        { rating, reviewMessage },
        { new: true }
    );

    if (!review) throw new ApiError(404, "Review not found!");




    res.status(200).json({ status: "success", data: review, message: "Review updated successfully" });

})
let deleteReview = asyncHandler(async (req, res) => {
    let productId = req.params.productId
    if (!productId) {
        throw new ApiError(400, "prodiuct Id is not found!")
    }
    let review = await Review.findOne({ product: productId })
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