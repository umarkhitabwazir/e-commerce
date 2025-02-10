import mongoose, { Schema } from "mongoose"

const reviewSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "user is required"],
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: [true, "product is required"],
        },
        rating: {
            type: Number,
            required: [true, "rating is required"],
        },
        reviewMessage: {
            type: String,
            required: [true, "review is required"],
        },
    }, { timestamps: true }

)

export const Review = mongoose.model("Review", reviewSchema)              
