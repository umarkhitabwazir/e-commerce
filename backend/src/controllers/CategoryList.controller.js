import { Category } from "../models/Category.model.js";
import { Product } from "../models/Product.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const allcategoryList=asyncHandler(async(req,res)=>{
    const category=await Category.find()
    res.status(200).json(
        new ApiResponse(200,category,"all category list")
    )
})

const categoryList=asyncHandler(async(req,res)=>{
const {categoryName}=req.query
console.log("categoryName",categoryName)
if (!categoryName) {
    throw new ApiError(400,"filled is required!")
}
const category=await Category.findOne({
    categoryName:categoryName
})
if (!category) {
    throw new ApiError(400,"not found this type of category")
}
const product=await Product.find({
    category:category.id
}).populate('category', 'categoryName')
res.status(200).json(
     new ApiResponse(200,product,"search category result")
)
})
const findCategoryProduct=asyncHandler(async(req,res)=>{
    const categoryName=req.query.category
    if (!categoryName) {
        throw new ApiError(401,"catogoryName name is required! ")
    }
    const findCategory=await Category.findOne({categoryName:categoryName})

    if (!findCategory) {
        throw new ApiError(401,"catogory not found with this name ")
    }
    const findCategoryProducts=await Product.find({category:findCategory.id})
    if (!findCategoryProducts) {
        throw new ApiError(401,"products not found with this category! ")
        
    }
    res.status(200).json(new ApiResponse(200,findCategoryProducts,'find product successfully'))

})

export {
    categoryList,
    allcategoryList,
    findCategoryProduct
}