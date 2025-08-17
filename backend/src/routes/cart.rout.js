import { Router } from "express";
import { authMiddleware } from "../middleWare/auth.Middle.js";
import { createCart, getCartData } from "../controllers/Cart.controller.js";

const cartRouter=Router()
cartRouter.route("/createCart").post(authMiddleware, createCart); 
cartRouter.route("/get-cart-data").get(authMiddleware,getCartData)

export {
    cartRouter
}