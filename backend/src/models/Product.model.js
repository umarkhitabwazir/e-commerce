import  mongoose, { Schema } from "mongoose";

let productSchema = new Schema({
    title: {
        type: String,
        required: [true, "title is required"],
        trim: true,
        index: true,

    },
    price: {
        type: Number,
        required: [true, "price is required"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "description is required"],
        trim: true,
    },

    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "category is required"],
    },
    image: {
        type: String,
        required: [true, "image is required"],
        trim: true,
    },
    rating: {
        type: Number,
        trim: true,
    },
    numReviews: {
        type: Number,
        trim: true,
    },
    countInStock: {
        type: Number,
        required: [true, "countInStock is required"],
        trim: true,
    },
    brand: {
        type: String,
        required: [true, "brand is required"],
        trim: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "user is required"],
    }

},
    { timestamps: true, user: true }
)

export let Product = mongoose.model("Product", productSchema)