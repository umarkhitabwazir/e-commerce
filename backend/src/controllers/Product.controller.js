import { Product } from "../models/Product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

let createProducts=asyncHandler(async(req,res)=>{
    let {title,price,description,image,countInStock,brand}=req.body

    if(!title||!price||!description||!image||!countInStock||!brand){
        throw new Error(400,"All fields are required")
    }
     
    
    let product = await Product.create({title,price,description,image,countInStock,brand})
    res.status(201).json(new ApiResponse(201,product,"Product created successfully"))
})


export {createProducts}