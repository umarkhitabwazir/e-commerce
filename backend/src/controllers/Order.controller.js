import { Order } from "../models/Order.model.js";
import { Product } from "../models/Product.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

let createOrder = asyncHandler(async (req, res) => {
    const { products, paymentMethod } = req.body;
    const userId = req.user;

    if (!userId) {
        throw new ApiError(400, "User not logged in");
    }
    if (!products || !Array.isArray(products) || products.length === 0 || !paymentMethod) {
        throw new ApiError(400, "Products and payment method are required");
    }
    // Validate and process products
    const validatedProducts = [];
    let productTotalPrice = 0;

    for (const item of products) {
        // Validate product fields
        if (!item.productId || !item.quantity || item.quantity <= 0) {
            throw new ApiError(400, `Each product must have a valid productId and quantity > 0`);
        }

        const product = await Product.findById(item.productId);
        if (!product) {
            throw new ApiError(404, `Product with ID ${item.productId} not found`);
        }

        // Accumulate total price
        productTotalPrice += product.price * item.quantity;

        // Prepare product data for the order
        validatedProducts.push({
            productId: product._id,
            quantity: item.quantity,
        });
    }

    // Calculate prices
    const taxPrice = (2 / 100) * productTotalPrice;
    const shippingPrice = 210; // Fixed shipping price
    const totalPrice = productTotalPrice + taxPrice + shippingPrice;

    // Create the order
    const order = await Order.create({
        userId,
        products: validatedProducts,
        paymentMethod,
        taxPrice,
        shippingPrice,
        totalPrice,
    });

    // Respond with the created order
    res.status(201).json(new ApiResponse(201, order, "Order created successfully"));
});

let updateOrder = asyncHandler(async (req, res) => {
    const orderId = req.params.orderId;
    const { products, paymentMethod } = req.body;

    if (!orderId) {
        throw new ApiError(400, "order is required");
    }
    if (!products || !Array.isArray(products) || products.length === 0 || !paymentMethod) {
        throw new ApiError(400, "Products and payment method are required");
    }
    let produdsArr = [];
    let productTotalPrice = 0;
    for (const item of products) {
        if (!item.productId || !item.quantity || item.quantity <= 0) {
            throw new ApiError(400, `Each product must have a valid productId and quantity > 0`);
        }
        const product = await Product.findById(item.productId);
        if (!product) {
            throw new ApiError(404, `Product with ID ${item.productId} not found`);
        }
        productTotalPrice += product.price * item.quantity;
        produdsArr.push({
            productId: item.productId,
            quantity: item.quantity,
        });

    }



    const order = await Order.findById(orderId);
    if (!order) {
        throw new ApiError(404, `Order with ID ${orderId} not found`);
    }

    order.products = produdsArr;
    order.paymentMethod = paymentMethod;
    order.taxPrice = (2 / 100) * productTotalPrice;
    order.shippingPrice = 210;
    order.totalPrice = productTotalPrice + order.taxPrice + order.shippingPrice;

    await order.save();

    res.status(200).json(new ApiResponse(200, order, "Order updated successfully"));
});

let deleteOder = asyncHandler(async (req, res) => {
    let orderId = req.params.orderId
    let user = req.user
    if (!user) {
        throw new ApiError(402, "user must be logined!")
    }

    if (!orderId) {
        throw new ApiError(401, "orderId is required!")
    }
    let order = await Order.findById(orderId)
    if (!order) {
        throw new ApiError(401, "order not found!")

    }


    if (order.userId.toString() !== user._id.toString()) {
        throw new ApiError(402, "you can't delete this order!")
    }
    await order.deleteOne()
    res.status(200).json(
        new ApiResponse(200, order, "order deleted successfully!")
    )

})

export {
    createOrder,
    updateOrder,
    deleteOder
};
