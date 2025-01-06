import { Product } from "../models/Product.model.js";
import { Category } from "../models/Category.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { upload } from "../middleWare/cloudinary.middle.js";

import cloudinary from "cloudinary"
import { uploadOnCloudinary } from "../utils/cloudinary.js";








let createProductsWithCategory = asyncHandler(async (req, res) => {
    let { categoryName, categoryDescription, categoryImage, title, price, description, countInStock, brand } = req.body
    let userId = req.user
    if (!userId) {
        throw new ApiError(400, "user not login")
    }
    let user = await User.findById(userId)


    if (!user.role === "admin") {
        throw new ApiError(400, "only admin can create products")
    }
    if (!categoryName || !categoryDescription || !categoryImage ||
        !title || !price || !description || !countInStock
        || !brand) {
        throw new ApiError(400, "All fields are required")
    }
    let category = await Category.findOne({ categoryName: categoryName })
    const localFilePath = req.file.path;


    if (!localFilePath) {
        throw new ApiError(402, "image path not found!")
    }
    let filesize = req.file.size

    if (filesize > 10485760) {
        throw new ApiError(402, "file too long only 10MB is allowed!")
    }
    let productImg = await uploadOnCloudinary(localFilePath)
    if (!productImg.url) {
        throw new ApiError(402, "image uploading faield!")
    }
    if (!category) {
        category = await Category.create({
            categoryName,
            categoryDescription,
            categoryImage,
            user: userId
        })
    }

    let product = await Product.create(
        {
            title,
            price,
            description,
            image: productImg.url,
            countInStock,
            brand,
            user: userId,
            category: category.id

        }
    )
    res.status(201).json(new ApiResponse(201, product, "Product created successfully"))
})

let updateProductWithCategory = asyncHandler(async (req, res) => {
    let { categoryName, categoryDescription, categoryImage, title, price, description, countInStock, brand } = req.body

    let user = req.user
    if (!user) {
        throw new ApiError(400, "user not login")
    }
    if (!user.role === "admin" | "superadmin") {
        throw new ApiError(400, "only admin can create products")
    }
    console.log(categoryName, categoryDescription, categoryImage, title, price, description, countInStock, brand)
    if (!categoryName || !categoryDescription || !categoryImage ||
        !title || !price || !description || !countInStock
        || !brand) {
        throw new ApiError(400, "All fields are required")
    }
    let productId = req.params.productid
    let product = await Product.findById(productId)

    if (!product) {
        throw new ApiError(404, "Product not found")
    }

    let category = await Category.findOne({ categoryName: categoryName })
    if (!category) {
        category = await Category.findByIdAndUpdate(
            product.category,
            {
                categoryName,
                categoryDescription,
                categoryImage,
                user: user.id
            })
    }



    let checkUserRole = product.user.toString() === user.id.toString() || user.role === "superadmin"
    if (!checkUserRole) {
        throw new ApiError(400, "You are not authorized to update this product")
    }

    if (!product) {
        throw new ApiError(404, "Product not found")
    }
    product.title = title
    product.price = price
    product.description = description
    product.countInStock = countInStock
    product.brand = brand


    let fileLocalPath = req.file.path
    let filesize = req.file.size
    let existimgUrl = product.image
    let publicIdWithExtension = existimgUrl.split("/").pop()
    let publicId = publicIdWithExtension.split(".")[0]
    if (filesize > 10485760) {
        throw new ApiError(402, "file too long only 10MB is allowed!")
    }

    if (fileLocalPath) {

        let productImg = await uploadOnCloudinary(fileLocalPath)
        if (!productImg) {
            throw new ApiError(402, "image uploading falid!")
        }

        
            let cloudImgPath = `ecommerce/products-img/${publicId}`
            let result = await cloudinary.uploader.destroy(cloudImgPath)
            if (result.result !== "ok") {
                throw new ApiError(500, "Failed to delete the existing image from Cloudinary");
            }
            console.log("result", result)
      

        product.image = productImg.url
    }
    await product.save()
    res.status(200).json(new ApiResponse(200, product, "Product updated successfully"))
})

let deleteProductWithCategory = asyncHandler(async (req, res) => {
    let user = req.user
    if (!user) {
        throw new ApiError(400, "user not login")
    }
    if (!user.role === "admin" | "superadmin") {
        throw new ApiError(400, "only admin can delete products")
    }
    let productId = req.params.productid
    let product = await Product.findById(productId)
    if (!product) {
        throw new ApiError(404, "Product not found")
    }
    let existimgUrl = product.image
    let publicIdWithExtension = existimgUrl.split("/").pop()
    let publicId = publicIdWithExtension.split(".")[0]
    let cloudImgPath = `ecommerce/products-img/${publicId}`
    
      await cloudinary.uploader.destroy(cloudImgPath)
    
    let findCategoryProduct = await Product.find({ category: product.category })

    let category = await Category.findById(product.category)
    if (!category) {
        throw new ApiError(404, "Category not found")
    }

    let checkUserRole = product.user.toString() === user.id.toString() || user.role === "superadmin"
    if (!checkUserRole) {
        throw new ApiError(400, "You are not authorized to delete this product")
    }
    if (findCategoryProduct.length === 1) {
        await category.deleteOne()
    }
    await product.deleteOne()

    res.status(200).json(new ApiResponse(200, product, "Product deleted successfully"))
})


export {
    createProductsWithCategory,
    updateProductWithCategory,
    deleteProductWithCategory

}