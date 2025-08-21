import mongoose from "mongoose";
import cloudinary from "cloudinary"
import { Order } from "../models/Order.model.js";
import { Product } from "../models/Product.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { Category } from "../models/Category.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/User.model.js";

dotenv.config({
    path: ".env"
})

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    logger: true,
    debug: true,
});

const sendEmail = async (email, image, title, price, subject) => {


    const mailOptions = {
        from: `"UK Bazaar" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: subject,
        html: `<!DOCTYPE html>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Order Confirmation</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f0f2f5;
            margin: 0;
            padding: 0;
        }
        .container {
            background-color: #ffffff;
            max-width: 600px;
            margin: 60px auto;
            padding: 40px 30px;
            border-radius: 12px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
            color: #333;
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #e0e0e0;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            color: #2c3e50;
        }
        .content {
            padding: 20px 0;
        }
        .content p {
            font-size: 16px;
            margin-bottom: 15px;
            line-height: 1.6;
            color: #555;
        }
        .order-details {
            background-color: #f9fafc;
            padding: 15px 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .order-details ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .order-details li {
            margin: 10px 0;
            font-size: 15px;
        }
        .product-image {
            margin-top: 10px;
            text-align: center;
        }
        .product-image img {
            max-width: 100%;
            height: auto;
            border-radius: 10px;
        }
        .footer {
            text-align: center;
            font-size: 14px;
            color: #777;
            border-top: 1px solid #e0e0e0;
            padding-top: 15px;
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Order Confirmation</h1>
        </div>
        <div class="content">
            <p>Thank you for your order!</p>
            <p>Your order has been <strong>${subject}</strong>.</p>

            <div class="order-details">
                <ul>
                    <li><strong>Product:</strong> ${title}</li>
                    <li><strong>Price:</strong> ${price}</li>
                </ul>
                <div class="product-image">
                    <img src="${image}" alt="${title}" />
                </div>
            </div>

            <p>We appreciate your business and hope to serve you again soon!</p>
            <p>Best regards,</p>
            <p><strong>UK Bazaar Team</strong></p>
        </div>
        <div class="footer">
            &copy; 2025 UK Bazaar. All rights reserved.
        </div>
    </div>
</body>
</html>


        `,
    };
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Failed to send email:", error);
                return reject(new ApiError(500, "Failed to send email"));
            }
            resolve(info);
        });
    });
};


const adminProducts = asyncHandler(async (req, res) => {
    const user = req.user
    if (!user) {
        throw new ApiError(401, false, "user not loged in!", false)
    }
    const userRole = user.role
    const role = ["superadmin", "admin"]
    if (!role.includes(userRole)) {
        throw new ApiError(401, false, "you can't access secure route", false)

    }
    const product = await Product.find({ user: user.id }).populate('category', 'categoryName')

    if (!product) {
        throw new ApiError(404, false, "no product founded", false)

    }
    res.status(200).json(new ApiResponse(200, product, "product founded", true))
})
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
let updateProductWithCategory = asyncHandler(async (req, res) => {
    let { categoryName, title, price, description, countInStock, brand } = req.body

    let user = req.user


    if (!user) {
        throw new ApiError(400, "user not logged in")
    }
    if (!user.role === "admin") {
        throw new ApiError(400, "only admin can update products")
    }
    if (!categoryName ||
        !title || !price || !description || !countInStock
        || !brand) {
        throw new ApiError(400, "All fields are required")
    }
    let productId = req.params.productid
    let product = await Product.findById(productId)
    console.log('product in update route', product)
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



    let checkUserRole = product.user.toString() === user.id.toString()
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

    const file = req.file

    if (!file) {
        await product.save()
        return res.status(200).json(new ApiResponse(200, product, "Product updated successfully"))
    }
    let filesize = req.file.size
    let existimgUrl = product.image
    let publicIdWithExtension = existimgUrl.split("/").pop()
    let publicId = publicIdWithExtension.split(".")[0]
    if (filesize > 10485760) {
        throw new ApiError(402, "file too long only 10MB is allowed!")
    }
    const base64File = req.file.buffer;
    if (base64File) {
        // const base64File = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

        let productImg = await uploadOnCloudinary(base64File)
        console.log('productImg', productImg)
        if (!productImg) {
            throw new ApiError(402, "image uploading falid!")
        }


        let cloudImgPath = `ecommerce/products-img/${publicId}`
        // let result = await uploadOnCloudinary.uploader.destroy(cloudImgPath)
        let result = await cloudinary.uploader.destroy(cloudImgPath)
        console.log('result', result)
        if (result.result !== "ok") {
            throw new ApiError(500, "Failed to delete the existing image from Cloudinary");
        }


        product.image = productImg.url
        console.log('product.image ', productImg.url)
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
    const existOrder = await Order.findOne({ "products.productId": productId });
    if (existOrder) {
        throw new ApiError(400, "Cannot delete product as it is part of an existing order");   
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
const getOrdersByAdminProducts = asyncHandler(async (req, res) => {
    try {
        const user = req.user?._id;
        if (!user) {
            throw new ApiError(401, "User not logged in");
        }


        const adminProducts = await Product.find({ user: user })


        const getAllOrdered = await Order.find()
            .populate("userId", "username email phone")
            .populate("products.productId", "title price image")

        // Extract product IDs of admin's products
        const adminProductIds = adminProducts.map((product) => product._id);
        // Filter orders containing admin's products
        const filterAdminProducts = getAllOrdered.filter((order) =>
            order.products.map((p) => adminProductIds.includes(new mongoose.Types.ObjectId(p.productId?._id)))
        );
        // console.log('filterAdminProducts', filterAdminProducts)
        // const now = new Date();
        // const currentTime = now.getTime();
        // const halfHourInMs = 30 * 60 * 1000;
        // const halfHourAgo = currentTime - halfHourInMs;
        // const halfHourAgoDate = new Date(halfHourAgo);

        // const ordersOlderThanHalfHour = filterAdminProducts.filter((order) => {
        //     return new Date(order.createdAt) <= halfHourAgoDate;
        // });


        res.status(200).json(new ApiResponse(200, filterAdminProducts));
    } catch (error) {
        console.error("getOrderedProducts Error:", error);
        res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
    }
});

const orderConfirmed = asyncHandler(async (req, res) => {
    const user = req.user
    const { orderId } = req.params
    if (!user) {
        throw ApiError(401, false, "user not loged in!", false)
    }
    if (!orderId) {
        throw new ApiError(401, false, "order id not provided", false)
    }
    const userRole = user.role
    const role = ["admin"]
    if (!role.includes(userRole)) {
        throw new ApiError(401, false, "you can't access secure route", false)

    }
    const order = await Order.findById(orderId)
    if (!order) {
        throw new ApiError(404, false, "no order founded", false)

    }


    const orderconfirm = order.confirmed
    order.confirmed = !orderconfirm
    await order.save()
    res.status(200).json(new ApiResponse(200, null, "order confirmed", true))
})
const paymentConfirmed = asyncHandler(async (req, res) => {
    const user = req.user
    const { orderId } = req.params
    if (!user) {
        throw ApiError(401, false, "user not loged in!", false)
    }
    if (!orderId) {
        throw new ApiError(401, false, "order id not provided", false)
    }
    const userRole = user.role
    const role = ["admin"]
    if (!role.includes(userRole)) {
        throw new ApiError(401, false, "you can't access secure route", false)

    }
    const order = await Order.findById(orderId)
    if (!order) {
        throw new ApiError(404, false, "no order founded", false)

    }
    const pymentconfirmation = order.isPaid
    order.isPaid = !pymentconfirmation
    await order.save()
    res.status(200).json(new ApiResponse(200, order, "Payment received", true))
})
const orderShipping = asyncHandler(async (req, res) => {
    const user = req.user
    const { orderId } = req.params
    if (!user) {
        throw ApiError(401, false, "user not loged in!", false)
    }
    if (!orderId) {
        throw new ApiError(401, false, "order id not provided", false)
    }
    const userRole = user.role
    const role = ["admin"]
    if (!role.includes(userRole)) {
        throw new ApiError(401, false, "you can't access secure route", false)

    }
    const order = await Order.findById(orderId)
    if (!order) {
        throw new ApiError(404, false, "no order founded", false)

    }
    const orderShipped = order.orderShipped
    order.orderShipped = !orderShipped

    await order.save()
    res.status(200).json(new ApiResponse(200, null, "Your order Shipped", true))
})
const orderReadyForPickUp = asyncHandler(async (req, res) => {
    const user = req.user
    const { orderId } = req.params
    if (!user) {
        throw ApiError(401, false, "user not loged in!", false)
    }
    if (!orderId) {
        throw new ApiError(401, false, "order id not provided", false)
    }
    const userRole = user.role
    const role = ["admin"]
    if (!role.includes(userRole)) {
        throw new ApiError(401, false, "you can't access secure route", false)

    }
    const order = await Order.findById(orderId)
    if (!order) {
        throw new ApiError(404, false, "no order founded", false)

    }
    const orderReadyForPickup = order.readyForPickup
    order.readyForPickup = !orderReadyForPickup

    await order.save()
    res.status(200).json(new ApiResponse(200, null, "Order ready for pickup", true))
})
const orderDelivered = asyncHandler(async (req, res) => {
    const user = req.user
    const { orderId } = req.params
    if (!user) {
        throw ApiError(401, false, "user not loged in!", false)
    }
    if (!orderId) {
        throw new ApiError(401, false, "order id not provided", false)
    }
    const userRole = user.role
    const role = ["admin"]
    if (!role.includes(userRole)) {
        throw new ApiError(401, false, "you can't access secure route", false)

    }
    const order = await Order.findById(orderId).populate("products.productId", "title price image").populate("userId", "email")
    if (!order) {
        throw new ApiError(404, false, "no order founded", false)

    }


    const orderDelivered = order.isDelivered
    order.isDelivered = !orderDelivered

    await order.save()
    const email = order.userId.email
    const image = order.products[0].productId.image
    const title = order.products[0].productId.title
    const price = order.products[0].productId.price
    const subject = order.isDelivered ? "delivered" : "not delivered"
    await sendEmail(email, image, title, price, subject)
    res.status(200).json(new ApiResponse(200, null, "order delivered successfully", true))
})
const orderPickedByCounter = asyncHandler(async (req, res) => {
    const user = req.user
    const { orderId } = req.params
    if (!user) {
        throw ApiError(401, false, "user not loged in!", false)
    }
    if (!orderId) {
        throw new ApiError(401, false, "order id not provided", false)
    }
    const userRole = user.role
    const role = ["admin"]
    if (!role.includes(userRole)) {
        throw new ApiError(401, false, "you can't access secure route", false)

    }
    const order = await Order.findById(orderId)
    if (!order) {
        throw new ApiError(404, false, "no order founded", false)

    }
    const orderDelivered = order.pickedByCounter
    order.pickedByCounter = !orderDelivered


    await order.save()
    res.status(200).json(new ApiResponse(200, null, "order Picked By counter", true))
})


export {

    adminProducts,
    createProductsWithCategory,
    updateProductWithCategory,
    deleteProductWithCategory,
    getOrdersByAdminProducts,
    orderConfirmed,
    paymentConfirmed,
    orderShipping,
    orderReadyForPickUp,
    orderDelivered,
    orderPickedByCounter

}