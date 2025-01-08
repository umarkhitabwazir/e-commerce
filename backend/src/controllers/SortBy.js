import { Product } from "../models/Product.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";


let sortPriceLowToHigh = asyncHandler(async (req, res) => {
    // Fetch all products and sort by price in ascending order
    let products = await Product.find().sort({ price: 1 });

    if (!products || products.length === 0) {
        throw new ApiError(400, "No products found");
    }

    res.status(200).json(
        new ApiResponse(200, products, "Products sorted by price (Low to High)")
    );
});
let sortPriceHighToLower = asyncHandler(async (req, res) => {
    // Fetch all products and sort by price in ascending order
    let products = await Product.find().sort({ price: -1 });

    if (!products || products.length === 0) {
        throw new ApiError(400, "No products found");
    }

    res.status(200).json(
        new ApiResponse(200, products, "Products sorted by price (  High to Low)")
    );
});

let sortNewest = asyncHandler(async (req, res) => {
    
    let products = await Product.find().sort({ createdAt: -1 });


    if (!products || products.length === 0) {
        throw new ApiError(400, "No products found");
    }

    res.status(200).json(
        new ApiResponse(200, products, "Products sorted by newest")
    );
});


export {
    sortPriceLowToHigh,
    sortPriceHighToLower,
    sortNewest

}