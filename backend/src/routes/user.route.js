import { Router } from "express";
import { createUser, loginUser, logoutUser, verifyEmail,updateUser,
  listAllUser,resendEmailVerificationCode } from "../controllers/User.controller.js";
import { createProductsWithCategory,getAllProducts,updateProductWithCategory,deleteProductWithCategory } from "../controllers/Product.controller.js";
import { categoryList } from "../controllers/CategoryList.controller.js";
import { createCart } from "../controllers/Cart.controller.js";
import { createOrder, updateOrder,deleteOder } from "../controllers/Order.controller.js";
import { transferMoney } from "../controllers/MoneyTransfer.controller.js";
import {reviewController,updateReview,deleteReview} from "../controllers/Review.controller.js";
import { sortPriceLowToHigh,sortPriceHighToLower, sortNewest } from "../controllers/SortBy.js";
import { body, validationResult } from "express-validator";
import { ApiError } from "../utils/apiError.js";
import twilio from "twilio";
import dotenv from "dotenv";
import { authMiddleware } from "../middleWare/auth.Middle.js";
import { authorizeRoles } from "../middleWare/authorizeRoles.middle.js";
import { upload } from "../middleWare/cloudinary.middle.js";

dotenv.config({
  path: ".env"

})


let router = Router()
router.route("/user/signup").post(
  [
    body("email").isEmail().withMessage("Invalid email address"),
    body("phone").isMobilePhone().withMessage("Invalid phone number"),

  ],
  createUser)

router.route("/user/login").post(
  [
    body("email").isEmail().withMessage("Invalid email address"),

  ],
  loginUser)
router.route("/resendVerificationCode").post(authMiddleware, resendEmailVerificationCode)
router.route("/user/logout").post(authMiddleware, logoutUser)
router.route("/updateUser").patch(authMiddleware, updateUser)
router.route("/listAllUser").get(authMiddleware,authorizeRoles("superadmin"), listAllUser)
router.route("/product/create").post(authMiddleware,authorizeRoles("superadmin","admin"),upload.single("productImg"), createProductsWithCategory)
router.route("/priceLowHigh").get(sortPriceLowToHigh)
router.route("/priceHighLow").get(sortPriceHighToLower)
router.route("/newest").get(sortNewest)
router.route("/get-products").get(getAllProducts)
router.route("/product/update/:productid").patch(authMiddleware,authorizeRoles("superadmin","admin"),upload.single("productImg"), updateProductWithCategory)
router.route("/categoryList").post(categoryList)
router.route("/product/delete/:productid").delete(authMiddleware,authorizeRoles("superadmin","admin"),deleteProductWithCategory)
router.route("/order").post(authMiddleware,createOrder)
router.route("/order/update/:orderId").patch(authMiddleware,updateOrder)
router.route("/order/delete/:orderId").delete(authMiddleware,deleteOder)
router.route("/createCart").post(authMiddleware,createCart)
router.route("/review/:productId").post(authMiddleware,reviewController)
router.route("/update/:productId").patch(authMiddleware,updateReview)
router.route("/delete/:productId").delete(authMiddleware,deleteReview)
router.route("/transferMoney").post(authMiddleware,transferMoney)

router.route("/verify-email").post(authMiddleware, verifyEmail);






export { router }