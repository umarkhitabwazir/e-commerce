import mongoose from "mongoose";
import { Cart } from "../models/Cart.model.js";
import { Product } from "../models/Product.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createCart = asyncHandler(async (req, res) => {
    const { cartItem } = req.body
    const userId = req.user

    if (!Array.isArray(cartItem)) {
        throw new ApiError(400, "cartitem is required!")
    }
    if (!userId) {
        throw new ApiError(400, "user not login")
    }
    const cartArr = []
    let checkExistCartProduct

    for (const item of cartItem) {

        const products = await Product.findById(item.product)

        if (!products) {
            throw new ApiError(400, "product not found!")
        }
        const productPrice = products.price * item.quantity

        cartArr.push({
            product: products.id,
            quantity: item.quantity,
            price: productPrice

        })
        checkExistCartProduct = await Cart.findOne({
            "cartItems.product": products.id
        });
        if (checkExistCartProduct) {
            await Cart.updateOne(
                {
                    user: userId._id,
                    "cartItems.product": new mongoose.Types.ObjectId(products.id)
                },
                {
                    $inc: {
                        "cartItems.$.quantity": item.quantity,
                        "cartItems.$.price": productPrice,

                    }
                }, // query

            );

        }

    }
    let createCart
    if (!checkExistCartProduct) {

        createCart = await Cart.create({
            user: userId,
            cartItems: cartArr
        })
    }
    res.status(201).json(
        new ApiResponse(201, createCart, "item  added to cart successfully! ")
    )

})
const deleteCart = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(401, "User not logged in");
  }

  const cartId = req.params.cartId;

  if (!cartId) {
    throw new ApiError(400, "cart ID is required");
  }
  const ObjectId=new mongoose.Types.ObjectId(cartId)


  const cart = await Cart.deleteOne(ObjectId)

  if (!cart) {
    throw new ApiError(404, "Cart not found or product not in cart");
  }

  res
    .status(200)
    .json(new ApiResponse(200, cart, " cart removed successfully"));
});

const getCartData = asyncHandler(async (req, res) => {
    const user = req.user
    if (!user) {
        throw new ApiError(401, "Unauthorized")
    }
    const findUserCart = await Cart.find({ user: user._id }).populate('cartItems.product', 'image title price description');

    res.status(200).json(new ApiResponse(200, findUserCart, 'cart data founded'))
})



export {
    createCart,
    deleteCart,
    getCartData

}