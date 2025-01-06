import mongoose from "mongoose";
import { Cart } from "../models/Cart.model.js";
import { Category } from "../models/Category.model.js";
import { Product } from "../models/Product.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.model.js";

let createCart = asyncHandler(async (req, res) => {
    let { cartItem } = req.body
    let userId = req.user
    console.log("userId", userId)
    if (!Array.isArray(cartItem)) {
        throw new ApiError(400, "cartitem is required!")
    }
    if (!userId) {
        throw new ApiError(400, "user not login")
    }
    let cartArr = []
 
    for (let item of cartItem) {
console.log("item.product",item.product)

        let product = await Product.findById( item.product)
        
        if (!product) {
            throw new ApiError(400,"product not found!")
        }
        let productPrice=product.price * item.quantity
        
        cartArr.push({
            product:product.id,
            quantity:item.quantity,
            price:productPrice

        })
    }
   
    let createCart=await Cart.create({
        user:userId,
        cartItems:cartArr
    })
    res.status(201).json(
        new ApiResponse(201,createCart,"item  added to cart successfully! ")
    )

})



export { createCart }