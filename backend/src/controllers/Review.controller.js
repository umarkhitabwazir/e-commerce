import { Review } from "../models/Review.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

let reviewController = asyncHandler(async (req, res) => {
    const {  product, rating, reviewMessage } = req.body;
    let userId=req.user
    if (!userId) {
        res.status(400).json({ message: "user must be logined in!" });
    }

    if ( !product || !rating || !reviewMessage) {
        res.status(400).json({ message: "All fields are required" });
    }
    let review = await Review.create({
        user: userId,
        product,
        rating,
        reviewMessage,
    });
    res.status(200).json(
        new ApiResponse(201, review, "Review created successfully")
    )
});

export { reviewController };