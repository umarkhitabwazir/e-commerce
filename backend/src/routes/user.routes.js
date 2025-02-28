import { Router } from "express";
import {
  createUser, loginUser, logoutUser, verifyEmail, updateUser,
  resendEmailVerificationCode,
  getLoginUserData
} from "../controllers/User.controller.js";
import {searchProduct, getAllProducts, getSingleProduct, getSearchedProduct, } from "../controllers/Product.controller.js";
import { categoryList } from "../controllers/CategoryList.controller.js";
import { createCart } from "../controllers/Cart.controller.js";
import {previewOrder,createOrder, updateOrder,getOrder, deleteOder, singleUserOrder, findOrderedProducts, cancelOrder } from "../controllers/Order.controller.js";
import { transferMoney } from "../controllers/MoneyTransfer.controller.js";
import { reviewController, updateReview, deleteReview, getAllReviews } from "../controllers/Review.controller.js";
import { sortPriceLowToHigh, sortPriceHighToLower, sortNewest } from "../controllers/SortBy.js";
import { body,  } from "express-validator";
import { addressController,findAddress } from "../controllers/Address.controller.js";

import dotenv from "dotenv";
import { authMiddleware } from "../middleWare/auth.Middle.js";



dotenv.config({
  path: ".env"

})


const userRouter = Router()
// User Routes
userRouter.route("/user/signup").post(
  [
    body("email").isEmail().withMessage("Invalid email address"),
    body("phone").isMobilePhone().withMessage("Invalid phone number"),
  ],
  createUser
); // Create a new user (Signup)

// Login Route
userRouter.route("/user/login").post(
  [
    body("email").isEmail().withMessage("Invalid email address"),
  ],
  loginUser
); // Login user

// Resend Verification Code
userRouter.route("/resendVerificationCode").post(authMiddleware, resendEmailVerificationCode); // Resend verification code for email

// Logout Route
userRouter.route("/user/logout").post(authMiddleware, logoutUser); // Logout user

// Update User
userRouter.route("/updateUser").patch(authMiddleware, updateUser); // Update user details



// Get Logged-in User
userRouter.route("/get-logined-user").get(authMiddleware, getLoginUserData); // Fetch data of the logged-in user

// Product Routes

// Sorting Routes
userRouter.route("/priceLowHigh").get(sortPriceLowToHigh); // Sort products by price (Low to High)
userRouter.route("/priceHighLow").get(sortPriceHighToLower); // Sort products by price (High to Low)
userRouter.route("/newest").get(sortNewest); // Sort products by newest first

// Get All Products
userRouter.route("/search-products").get(searchProduct); // search products
userRouter.route("/get-searched-products").get(getSearchedProduct); //get searched products
userRouter.route("/get-products").get(getAllProducts); // Retrieve all products

// Get Single Product
userRouter.route("/get-single-product/:productId").get( getSingleProduct); // Fetch details of a single product by ID


// Category List
userRouter.route("/categoryList").post(categoryList); // Create a category list


// Order Routes
userRouter.route("/preview-order").post(previewOrder); // preview an order
userRouter.route("/create-order").post(authMiddleware,createOrder); // Create an order
userRouter.route("/user-order").get(authMiddleware,singleUserOrder); // get single user orders
userRouter.route("/cancel-order/:orderId").post(authMiddleware,cancelOrder); // cancel an order
userRouter.route("/find-ordered-products").post(authMiddleware,findOrderedProducts); //find Ordered Products
userRouter.route("/order/update/:orderId").patch(authMiddleware, updateOrder); // Update an order
userRouter.route("/get-order/:productId").get(authMiddleware,getOrder); // get  an product  order
userRouter.route("/order/delete/:orderId").delete(authMiddleware, deleteOder); // Delete an order

// Address Routes
userRouter.route("/address").post(authMiddleware,
  body("phone").isMobilePhone().withMessage("Invalid phone number"),
  addressController
); // Add an address
userRouter.route("/find-address").get(authMiddleware,findAddress) //find user address

// Cart Routes
userRouter.route("/createCart").post(authMiddleware, createCart); // Add an item to the cart

// Review Routes
userRouter.route("/review/:productId").post(authMiddleware, reviewController); // Add a review for a product
userRouter.route("/get-all-reviews").get(getAllReviews); // get  a review for a product
userRouter.route("/update/:productId").patch(authMiddleware, updateReview); // Update a review
userRouter.route("/delete/:productId").delete(authMiddleware, deleteReview); // Delete a review

// Money Transfer Route
userRouter.route("/transferMoney").post(authMiddleware, transferMoney); // Transfer money (user action)

// Verify Email Route
userRouter.route("/verify-email").post(authMiddleware, verifyEmail); // Verify user's email






export { userRouter }