import { Category } from "../models/Category.model.js";
import { Product } from "../models/Product.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

let categoryList=asyncHandler(async(req,res)=>{
let {categoryName}=req.query
console.log("categoryName",categoryName)
if (!categoryName) {
    throw new ApiError(400,"filled is required!")
}
let category=await Category.findOne({
    categoryName:categoryName
})
if (!category) {
    throw new ApiError(400,"not found this type of category")
}
let product=await Product.find({
    category:category.id
})
res.status(200).json(
     new ApiResponse(200,product,"search category result")
)
})

export {categoryList}