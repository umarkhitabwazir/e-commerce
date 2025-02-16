import { Product } from "../models/Product.model.js";
import { Category } from "../models/Category.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";


import cloudinary from "cloudinary"
import { uploadOnCloudinary } from "../utils/cloudinary.js";








let createProductsWithCategory = asyncHandler(async (req, res) => {
    let{ categoryName, title, price, description, countInStock, brand } = req.body
    let userId = req.user
    try {
           if (!userId) {
            throw new ApiError(400, "user not login")
        }
        let user = await User.findById(userId)
    
    
        if (!user.role === "admin" || !user.role === "superadmin") {
            throw new ApiError(400, "only admin can create products")
        }
        if (!categoryName ||
            !title || !price || !description || !countInStock
            || !brand) {
            throw new ApiError(400, "All fields are required")
        }
        let category = await Category.findOne({ categoryName: categoryName })
        let localFilePath = req.file.path;
    
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
        
    } catch (error) {
        console.log('Product Not created error',error)
    }
})

let updateProductWithCategory = asyncHandler(async (req, res) => {
    let{ categoryName,  title, price, description, countInStock, brand } = req.body

    let user = req.user
    if (!user) {
        throw new ApiError(400, "user not logged in")
    }
    if (!user.role === "admin" | "superadmin") {
        throw new ApiError(400, "only admin can update products")
    }
    if (!categoryName ||
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

    let findProductCategory = await Product.find({ category: product.category })

    let category = await Category.findById(product.category)
    if (!category) {
        throw new ApiError(404, "Category not found")
    }

    let checkUserRole = product.user.toString() === user.id.toString() || user.role === "superadmin"
    if (!checkUserRole) {
        throw new ApiError(400, "You are not authorized to delete this product")
    }
    if (findProductCategory.length === 1) {
        await category.deleteOne()
    }
    await product.deleteOne()

    res.status(200).json(new ApiResponse(200, product, "Product deleted successfully"))
})
let getAllProducts = asyncHandler(async (req, res) => {
    let product = await Product.find()
   
    res.status(200).json(
        new ApiResponse(200, product, "fetch all product successfully!")
    )
})

let getSingleProduct = asyncHandler(async (req, res) => {

    let productId = req.params.productId
    if (!productId) {
        throw new ApiError(400, "productId is required!")
    }
    let product = await Product.findById(productId)
    if (!product) {
        throw new ApiError(400, "product not found")
    }

    res.status(200).json(
        new ApiResponse(200, product, "product founded")
    )
})


export {
    createProductsWithCategory,
    getAllProducts,
    getSingleProduct,
    updateProductWithCategory,
    deleteProductWithCategory

}