import express from "express";
import { authMiddleware } from "../middleWare/auth.Middle.js";
import { cancelOrder, createOrder, deleteOder, findOrderedProducts, getOrder, previewOrder, singleUserOrder, updateOrder } from "../controllers/Order.controller.js";

export const orderRouters = express.Router();

// Order Routes
orderRouters.route("/preview-order").post(previewOrder); // preview an order
orderRouters.route("/create-order").post(authMiddleware,createOrder); // Create an order
orderRouters.route("/user-order").get(authMiddleware,singleUserOrder); // get single user orders
orderRouters.route("/cancel-order/:orderId").post(authMiddleware,cancelOrder); // cancel an order
orderRouters.route("/find-ordered-products").post(authMiddleware,findOrderedProducts); //find Ordered Products
orderRouters.route("/order/update/:orderId").patch(authMiddleware, updateOrder); // Update an order
orderRouters.route("/get-order/:productId").get(authMiddleware,getOrder); // get  an product  order
orderRouters.route("/order/delete/:orderId").delete(authMiddleware, deleteOder); // Delete an order
