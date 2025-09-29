import { Category } from "../models/Category.model.js";
import { Product } from "../models/Product.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const allcategoryList=asyncHandler(async(req,res)=>{
   const categoriesWithProducts = await Category.aggregate([
  {
    $lookup: {
      from: "products", // name of your Product collection
      localField: "_id",
      foreignField: "category",
      as: "products"
    }
  },
  { $match: { "products.0": { $exists: true } } }, // keep only categories with at least 1 product
  { $project: { products: 0 } } // optional, remove product array from result
]);

    res.status(200).json(
        new ApiResponse(200,categoriesWithProducts,"all category list")
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
    console.log("categoryName",categoryName)
    if (!categoryName) {
        throw new ApiError(401,"catogoryName name is required! ")
    }
    const findCategory=await Category.findOne({categoryName:categoryName})
    
    if (findCategory === null) {
        throw new ApiError(404,"catogory not found with this name ")
    }
    const findCategoryProducts=await Product.find({category:findCategory.id})
    console.log('findCategoryProducts', findCategoryProducts)
    if (findCategoryProducts.length === 0) {
        throw new ApiError(404,"product not found with this category")
        
    }
    res.status(200).json(new ApiResponse(200,findCategoryProducts,'find product successfully'))

})

export {
    categoryList,
    allcategoryList,
    findCategoryProduct
}