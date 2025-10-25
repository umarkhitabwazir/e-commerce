import { Product } from "../models/Product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";


let searchProduct = asyncHandler(async (req, res) => {
    let { search } = req.query
    if (!search) {
        throw new ApiError(400, "search query is required")
    }
    let product = await Product.find({ title: { $regex: search, $options: "i" } })
    if (!product) {
        throw new ApiError(404, "Product not found")
    }
    res.status(200).json(new ApiResponse(200, product, "Product found"))
})


let getAllProducts = asyncHandler(async (req, res) => {
    let product = await Product.find()

    res.status(200).json(
        new ApiResponse(200, product, "fetch all product successfully!")
    )
})

let getProductsByIds = asyncHandler(async (req, res) => {

    const { productIdsArr } = req.body
    if (productIdsArr.length > 0) {
        const objectIds = productIdsArr.map((p) => new mongoose.Types.ObjectId(p));
        const productArr = await Product.find({
            _id: { $in: objectIds }
        });
    if (productArr.length === 0) {
            throw new ApiError(404, "No products found for the provided IDs")
        }
    return res.status(200).json(
        new ApiResponse(200, productArr, "product founded")
    )
    }
    throw new ApiError(400, "productId or productIdsArr is required")


})


export {
    searchProduct,
    getAllProducts,
    getProductsByIds,
   

}