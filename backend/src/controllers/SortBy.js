import { Product } from "../models/Product.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";


const sortPriceLowToHigh = asyncHandler(async (req, res) => {
    // Fetch all products and sort by price in ascending order
    const products = await Product.find().sort({ price: 1 });

    if (!products || products.length === 0) {
        throw new ApiError(400, "No products found");
    }

    res.status(200).json(
        new ApiResponse(200, products, "Products sorted by price (Low to High)")
    );
});
const sortPriceHighToLower = asyncHandler(async (req, res) => {
    // Fetch all products and sort by price in ascending order
    const products = await Product.find().sort({ price: -1 });

    if (!products || products.length === 0) {
        throw new ApiError(400, "No products found");
    }

    res.status(200).json(
        new ApiResponse(200, products, "Products sorted by price (  High to Low)")
    );
});

const sortNewest = asyncHandler(async (req, res) => {
    
    const products = await Product.find().sort({ createdAt: -1 });


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