import mongoose, { Schema } from "mongoose"

const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "userId is required"],
        trim: true,
    },
    products: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: "Product",
                required: [true, "productId is required"],
                trim: true,
            },
            quantity: {
                type: Number,
                required: [true, "quantity is required"],
                trim: true,
            },
        }
    ],
    paymentMethod: {
        type: String,
        required: false,
        trim: true,
    },
    paymentResult: {
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String },
    },
    taxPrice: {
        type: Number,
        required: [true, "taxPrice is required"],
        trim: true,
    },
    shippingPrice: {
        type: Number,
        required: [true, "shippingPrice is required"],
        trim: true,
    },
    totalPrice: {
        type: Number,
        required: [true, "totalPrice is required"],
        trim: true,
    },
    isPaid: {
        type: Boolean,
        required: [true, "isPaid is required"],
        trim: true,
        default: false,
    },
    paidAt: {
        type: Date,
    },
    cancelled: {
        type: Boolean,
        default: false,
    },
    isDelivered: {
        type: Boolean,
        required: [true, "isDelivered is required"],
        trim: true,
        default: false,
    },
    deliveredAt: {
        type: Date,
    },
},
    { timestamps: true, user: true }

)
export const Order = mongoose.model("Order", orderSchema)