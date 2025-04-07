import mongoose from "mongoose";
import { Order } from "../models/Order.model.js";
import { Product } from "../models/Product.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";



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
    const product = await Product.find({ user: user.id })
    if (!product) {
        throw new ApiError(404, false, "no product founded", false)

    }
    res.status(200).json(new ApiResponse(200, product, "product founded", true))
})
const getOrdersByAdminProducts = asyncHandler(async (req, res) => {
    try {
        const user = req.user?._id;
        if (!user) {
            throw new ApiError(401, "User not logged in");
        }

        // Fetch products belonging to the admin
        const adminProducts = await Product.find({ user: user })

        // Get all orders
        const getAllOrdered = await Order.find()
        .populate("userId","username email phone" )
        .populate("products.productId", "title price image")

        console.log ("ordered", JSON.stringify( getAllOrdered, null, 2))
        // Extract product IDs of admin's products
        const adminProductIds = adminProducts.map((product) => product._id);
        console.log("Admin Product IDs:", adminProductIds);
        // Filter orders containing admin's products
        const filterAdminProducts = getAllOrdered.filter((order) =>
            order.products.map((p) =>  adminProductIds.includes(new mongoose.Types.ObjectId( p.productId?._id)))
        ); 
        const now = new Date();
        const currentTime = now.getTime();
        const halfHourInMs = 30 * 60 * 1000;
        const halfHourAgo = currentTime - halfHourInMs;
        const halfHourAgoDate = new Date(halfHourAgo);
        
        const ordersOlderThanHalfHour = filterAdminProducts.filter((order) => {
          return new Date(order.createdAt) <= halfHourAgoDate;
        });
        
    
        res.status(200).json(new ApiResponse(200, ordersOlderThanHalfHour));
    } catch (error) {
        console.error("getOrderedProducts Error:", error);
        res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
    }
});

const orderConfirmed = asyncHandler(async (req, res) => {
 const user= req.user
 const { orderId } = req.params
    if (!user) {
        throw  ApiError(401, false, "user not loged in!", false)
    }
    if (!orderId) {
        throw new ApiError(401, false, "order id not provided", false)
    }
    const userRole = user.role
    const role = [ "admin"]
    if (!role.includes(userRole)) {
        throw new ApiError(401, false, "you can't access secure route", false)

    }
    const order=await Order.findById(orderId)
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
    order.readyForPickup = ! orderReadyForPickup 
   
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
    const order = await Order.findById(orderId)
    if (!order) {
        throw new ApiError(404, false, "no order founded", false)

    }
    const orderDelivered = order.isDelivered
    order.isDelivered = !orderDelivered
   
    await order.save()
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
    getOrdersByAdminProducts,
    orderConfirmed,
    paymentConfirmed,
    orderShipping,
    orderReadyForPickUp,
    orderDelivered,
    orderPickedByCounter

}