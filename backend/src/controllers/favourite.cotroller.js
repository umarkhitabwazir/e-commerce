import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Favorite from "../models/favorit.model.js"
import { Product } from "../models/Product.model.js";
import mongoose from "mongoose";

const addtoFavorateProducts=asyncHandler(async(req,res)=>{
    const {productId}=req.params
    const user=req.user

    if (!productId) {
        throw new ApiError(401,'product id is required')
    }
try {
    const objId=new mongoose.Types.ObjectId(productId)
    
        const isExitProduct=await Product.findById(objId)
        if (!isExitProduct) {
            throw new ApiError(401,'product not Founded!')
        }
        const isExistProductInFav=await Favorite.find({item:isExitProduct._id})
        console.log('isExistProductInFav',isExistProductInFav)
        if (isExistProductInFav.length !==0) {
            
       return res.status(409).json(new ApiResponse(409,isExistProductInFav, "Favorite already exists for this user."))
            
        }
        const addToFav=await Favorite.create({user:user._id,item:isExitProduct._id})
    
        res.status(200).json(new ApiResponse(200,addToFav))
} catch (error) {
    console.log('error in fav',error)
}
})
const getFavProducts=asyncHandler(async(req,res)=>{
const user=req.user
const findFavProducts=await Favorite.find({user:user._id}).populate("item",'image title price description rating countInStock')

if (!findFavProducts) {
    throw new ApiError(404,'not found ')
}
res.status(200).json(new ApiResponse(200,findFavProducts))
})

const removeFavProduct=asyncHandler(async(req,res)=>{
    const {productId}=req.params
    if (!productId) {
        throw new ApiError(401,'product id is required')
    }
     const objId=new mongoose.Types.ObjectId(productId)
    
        const isExitProduct=await Product.findById(objId)
        if (!isExitProduct) {
            throw new ApiError(404,'product not founded')
        }
        const removeproductFromFav=await Favorite.deleteOne({item:isExitProduct._id})
        res.status(204).json(new ApiResponse(204,removeproductFromFav))
})

export{
    addtoFavorateProducts,
    getFavProducts,
    removeFavProduct
}