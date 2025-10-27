import express from "express";
import { authMiddleware } from "../middleWare/auth.Middle.js";
import { deleteReview, getAllReviews, reviewController, updateReview } from "../controllers/Review.controller.js";

export const reviewsRouters = express.Router();


// Review Routes
reviewsRouters.route("/review/:productId").post(authMiddleware, reviewController); // Add a review for a product
reviewsRouters.route("/get-all-reviews").get(getAllReviews); // get  a review for a product
reviewsRouters.route("/update/:reviewId").patch(authMiddleware, updateReview); // Update a review
reviewsRouters.route("/delete/:reviewId").delete(authMiddleware, deleteReview); // Delete a review
