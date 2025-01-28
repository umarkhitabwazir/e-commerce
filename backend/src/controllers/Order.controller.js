import { Order } from "../models/Order.model.js";
import { Product } from "../models/Product.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const TAX_RATE = parseFloat(process.env.TAX_RATE);
const SHIPPING_COST = parseFloat(process.env.SHIPPING_COST);

let previewOrder = asyncHandler(async (req, res) => {
    const { products } = req.body;



    if (!products || !Array.isArray(products) || products.length === 0) {
        throw new ApiError(400, "Products are required");
    }

    // Validate products
    const productIds = products.map((item) => item.productId);

    const dbProducts = await Product.find({ _id: { $in: productIds } });


    if (dbProducts.length !== products.length) {
        throw new ApiError(404, "One or more products not found");
    }

    let productTotalPrice = 0;
    const validatedProducts = products.map((item) => {
        const product = dbProducts.find((p) => p._id.toString() === item.productId);
        if (!product) {
            throw new ApiError(404, `Product with ID ${item.productId} not found`);
        }

        productTotalPrice += product.price * item.quantity;
        return {
            productId: product._id,
            quantity: item.quantity,
            price: product.price,
        };
    });
    let productquantities = validatedProducts.map((i) => i.quantity).flat().reduce((acc, quantity) => acc + quantity, 0)


    // Calculate prices
    const taxPrice = TAX_RATE * productTotalPrice;
    const shippingPrice = SHIPPING_COST;
    const totalPrice = productTotalPrice + taxPrice + shippingPrice;


    // Create the order
    try {
        const previewOrder = {

            products: validatedProducts,
            items: productquantities,
            taxPrice,
            shippingPrice,
            totalPrice,
        }
        console.log("previewOrder", previewOrder)
        res.status(201).json(
            new ApiResponse(201, previewOrder, "previewOrder created successfully")
        );
    } catch (error) {
        console.log(error)
        throw new ApiError(500, "Failed to create previewOrder", error);
    }
});

let createOrder = asyncHandler(async (req, res) => {
    const { products, paymentMethod } = req.body;
    const user = req.user;
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


    const order = await Order.create({
        userId: user._id,
        products: produdsArr,
        paymentMethod,
        taxPrice: (2 / 100) * productTotalPrice,
        shippingPrice: 210,
        totalPrice: productTotalPrice + TAX_RATE + SHIPPING_COST,
    });

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

let getOrder = asyncHandler(async (req, res) => {
    let user = req.user
    if (!user) {
        throw new ApiError(400, "user must be loged in!")
    }
    let productId = req.params.productId
    if (!productId) {
        throw new ApiError(400, "product id is required!")

    }
    let order = await Order.find({ products: { $elemMatch: { productId: productId } } });
    console.log('order', order)
    if (!order) {
        throw new ApiError(400, "order not founded!")
    }
    let logedInUser = order.map((i) => i.userId.toString())

    if (logedInUser.includes(user.id) === false) {
        throw new ApiError(400, "you can't access to the other user order!")

    }
    res.status(200).json(new ApiResponse(200, order, "order founded successfully!", true))
})

let singleUserOrder = asyncHandler(async (req, res) => {
    let user = req.user
    if (!user) {
        throw new ApiError(400, null, "user must be logged in")
    }
    let order = await Order.find({ userId: user.id })
    if (!order) {
        throw new ApiResponse(404, null, "order not founded")
    }
    console.log("order", order)
    res.status(200).json(new ApiResponse(200, order, "order founded!"))
})
let cancelOrder = asyncHandler(async (req, res) => {
    let orderId = req.params.orderId
    if (!orderId) {
        throw new ApiError(401, "orderId is required!")
    }
    let user = req.user
    if (!user) {
        throw new ApiError(402, "user must be logined!")
    }

    if (!orderId) {
        throw new ApiError(401, "orderId is required!")
    }
    let order = await Order.findById(orderId)
    order.cancelled= true
    await order.save()
    if (!order) {
        throw new ApiError(401, "order not found!")

    }
    res.status(200).json(new ApiResponse(200, order, "order canceled successfully!"))
})
let findOrderedProducts = asyncHandler(async (req, res) => {
    let { productIds } = req.body;
    console.log("productIds",productIds)
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      
        throw new ApiError(400, "Product IDs are required and must be a non-empty array");
    }
    const objectIds = productIds;
    console.log("objectIds", objectIds);
    let products = await Product.find({ _id: { $in: objectIds } })
    if (!products) {
        throw new ApiError(404, null, "products not founded")
    }

    res.status(200).json(new ApiResponse(200, products, "products founded", true));
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
    previewOrder,
    createOrder,
    findOrderedProducts,
    updateOrder,
    getOrder,
    cancelOrder,
    singleUserOrder,
    deleteOder
};
