import mongoose, { Schema } from "mongoose"

let cartSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "user is required"],
        },
        cartItems: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: [true, "product is required"],
                },
                quantity: {
                    type: Number,
                    required: [true, "quantity is required"],
                    default: 1,
                },
                price: {
                    type: Number,
                    required: [true, "price is required"],
                },
            },
        ],
    }, { timestamps: true }

)
export let Cart = mongoose.model("Cart", cartSchema)