import { Product } from "../models/Product.model.js";
import { Category } from "../models/Category.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";


import cloudinary from "cloudinary"
import { uploadOnCloudinary } from "../utils/cloudinary.js";








const createProductsWithCategory = asyncHandler(async (req, res) => {
    const{ categoryName, title, price, description, countInStock, brand } = req.body
    const userId = req.user
       if (!userId) {
        throw new ApiError(400, "user not login")
    }
    const user = await User.findById(userId)


    if (!user.role === "admin" || !user.role === "superadmin") {
        throw new ApiError(400, "only admin can create products")
    }
    if (!categoryName ||
        !title || !price || !description || !countInStock
        || !brand) {
        throw new ApiError(400, "All fields are required")
    }
    const category = await Category.findOne({ categoryName: categoryName })
    const localFilePath = req.file.path;
    console.log("localFilePath", localFilePath)

    if (!localFilePath) {
        throw new ApiError(402, "image path not found!")
    }
    const filesize = req.file.size

    if (filesize > 10485760) {
        throw new ApiError(402, "file too long only 10MB is allowed!")
    }
    const productImg = await uploadOnCloudinary(localFilePath)
    if (!productImg.url) {
        throw new ApiError(402, "image uploading faield!")
    }
    if (!category) {
        category = await Category.create({
            categoryName,

            user: userId
        })
    }

    const product = await Product.create(
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

const updateProductWithCategory = asyncHandler(async (req, res) => {
    const{ categoryName,  title, price, description, countInStock, brand } = req.body

    const user = req.user
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
    const productId = req.params.productid
    const product = await Product.findById(productId)

    if (!product) {
        throw new ApiError(404, "Product not found")
    }

    const category = await Category.findOne({ categoryName: categoryName })
    if (!category) {
        category = await Category.findByIdAndUpdate(
            product.category,
            {
                categoryName,

                user: user.id
            })
    }



    const checkUserRole = product.user.toString() === user.id.toString() || user.role === "superadmin"
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


    const fileLocalPath = req.file.path
    const filesize = req.file.size
    const existimgUrl = product.image
    const publicIdWithExtension = existimgUrl.split("/").pop()
    const publicId = publicIdWithExtension.split(".")[0]
    if (filesize > 10485760) {
        throw new ApiError(402, "file too long only 10MB is allowed!")
    }

    if (fileLocalPath) {

        const productImg = await uploadOnCloudinary(fileLocalPath)
        if (!productImg) {
            throw new ApiError(402, "image uploading falid!")
        }


        const cloudImgPath = `ecommerce/products-img/${publicId}`
        const result = await cloudinary.uploader.destroy(cloudImgPath)
        if (result.result !== "ok") {
            throw new ApiError(500, "Failed to delete the existing image from Cloudinary");
        }


        product.image = productImg.url
    }
    await product.save()
    res.status(200).json(new ApiResponse(200, product, "Product updated successfully"))
})

const deleteProductWithCategory = asyncHandler(async (req, res) => {
    const user = req.user
    if (!user) {
        throw new ApiError(400, "user not login")
    }
    if (!user.role === "admin" | "superadmin") {
        throw new ApiError(400, "only admin can delete products")
    }
    const productId = req.params.productid
    const product = await Product.findById(productId)
    if (!product) {
        throw new ApiError(404, "Product not found")
    }
    const existimgUrl = product.image
    const publicIdWithExtension = existimgUrl.split("/").pop()
    const publicId = publicIdWithExtension.split(".")[0]
    const cloudImgPath = `ecommerce/products-img/${publicId}`

    await cloudinary.uploader.destroy(cloudImgPath)

    const findProductCategory = await Product.find({ category: product.category })

    const category = await Category.findById(product.category)
    if (!category) {
        throw new ApiError(404, "Category not found")
    }

    const checkUserRole = product.user.toString() === user.id.toString() || user.role === "superadmin"
    if (!checkUserRole) {
        throw new ApiError(400, "You are not authorized to delete this product")
    }
    if (findProductCategory.length === 1) {
        await category.deleteOne()
    }
    await product.deleteOne()

    res.status(200).json(new ApiResponse(200, product, "Product deleted successfully"))
})
const getAllProducts = asyncHandler(async (req, res) => {
    const product = await Product.find()
   
    res.status(200).json(
        new ApiResponse(200, product, "fetch all product successfully!")
    )
})

const getSingleProduct = asyncHandler(async (req, res) => {

    const productId = req.params.productId
    if (!productId) {
        throw new ApiError(400, "productId is required!")
    }
    const product = await Product.findById(productId)
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