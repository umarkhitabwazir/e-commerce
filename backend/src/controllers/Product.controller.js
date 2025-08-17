import { Product } from "../models/Product.model.js";
import { Category } from "../models/Category.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import cloudinary from "cloudinary"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";








let createProductsWithCategory = asyncHandler(async (req, res) => {
    let { categoryName, title, price, description, countInStock, brand } = req.body
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

        let localFileBuffer = req.file?.buffer;


        if (!localFileBuffer) {
            throw new ApiError(402, "image path not found!")
        }
        let filesize = req.file.size

        if (filesize > 10485760) {
            throw new ApiError(402, "file too long only 10MB is allowed!")
        }
        let productImg = await uploadOnCloudinary(localFileBuffer)
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
        console.log('Product Not created error', error)
    }
})


let searchProduct = asyncHandler(async (req, res) => {
    let { search } = req.query
    if (!search) {
        throw new ApiError(400, "search query is required")
    }
    let product = await Product.find({ title: { $regex: search, $options: "i" } })
    if (!product) {
        throw new ApiError(404, "Product not found")
    }
    res.status(200).json(new ApiResponse(200, product, "Product found"))
})
let getSearchedProduct = asyncHandler(async (req, res) => {
    let { search } = req.query
    if (!search) {
        throw new ApiError(400, "search query is required")
    }
    let product = await Product.find({ title: { $regex: search, $options: "i" } })
    if (!product) {
        throw new ApiError(404, "Product not found")
    }
    res.status(200).json(new ApiResponse(200, product, "Product found"))
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

    const { productIdsArr } = req.body

    let product
    if (productId !== 'null') {
        product = await Product.findById(productId)
        return res.status(200).json(
            new ApiResponse(200, [product], "product founded"))
    }
    if (!product) {
        return null
    }
    if (productIdsArr) {
        const objectIds = productIdsArr.map((p) => new mongoose.Types.ObjectId(p.productId));
        product = await Product.find({
            _id: { $in: objectIds }
        });
        return res.status(200).json(
            new ApiResponse(200, product, "product founded")
        )
    }



})


export {
    createProductsWithCategory,
    searchProduct,
    getSearchedProduct,
    getAllProducts,
    getSingleProduct,
    deleteProductWithCategory

}