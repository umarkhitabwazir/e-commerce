import { Router } from "express";
import { authMiddleware } from "../middleWare/auth.Middle.js";
import { createCart, deleteCart, getCartData } from "../controllers/Cart.controller.js";

const cartRouter=Router()
cartRouter.route("/createCart").post(authMiddleware, createCart); 
cartRouter.route("/delete-cart/:cartId").delete(authMiddleware, deleteCart); 
cartRouter.route("/get-cart-data").get(authMiddleware,getCartData)

export {
    cartRouter
}