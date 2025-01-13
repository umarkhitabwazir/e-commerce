import { Router } from "express";
import {
  createUser, loginUser, logoutUser, verifyEmail, updateUser,
  listAllUser, resendEmailVerificationCode,
  getLoginUserData
} from "../controllers/User.controller.js";
import { createProductsWithCategory, getAllProducts, getSingleProduct, updateProductWithCategory, deleteProductWithCategory } from "../controllers/Product.controller.js";
import { categoryList } from "../controllers/CategoryList.controller.js";
import { createCart } from "../controllers/Cart.controller.js";
import { createOrder, updateOrder,getOrder, deleteOder } from "../controllers/Order.controller.js";
import { transferMoney } from "../controllers/MoneyTransfer.controller.js";
import { reviewController, updateReview, deleteReview } from "../controllers/Review.controller.js";
import { sortPriceLowToHigh, sortPriceHighToLower, sortNewest } from "../controllers/SortBy.js";
import { body, validationResult } from "express-validator";
import { addressController,findAddress } from "../controllers/Address.controller.js";
import twilio from "twilio";
import dotenv from "dotenv";
import { authMiddleware } from "../middleWare/auth.Middle.js";
import { authorizeRoles } from "../middleWare/authorizeRoles.middle.js";
import { upload } from "../middleWare/cloudinary.middle.js";

dotenv.config({
  path: ".env"

})


let router = Router()
// User Routes
router.route("/user/signup").post(
  [
    body("email").isEmail().withMessage("Invalid email address"),
    body("phone").isMobilePhone().withMessage("Invalid phone number"),
  ],
  createUser
); // Create a new user (Signup)

// Login Route
router.route("/user/login").post(
  [
    body("email").isEmail().withMessage("Invalid email address"),
  ],
  loginUser
); // Login user

// Resend Verification Code
router.route("/resendVerificationCode").post(authMiddleware, resendEmailVerificationCode); // Resend verification code for email

// Logout Route
router.route("/user/logout").post(authMiddleware, logoutUser); // Logout user

// Update User
router.route("/updateUser").patch(authMiddleware, updateUser); // Update user details

// List All Users
router.route("/listAllUser").get(authMiddleware, authorizeRoles("superadmin"), listAllUser); // List all users (Superadmin only)

// Get Logged-in User
router.route("/get-logined-user").get(authMiddleware, getLoginUserData); // Fetch data of the logged-in user

// Product Routes
router.route("/product/create").post(
  authMiddleware,
  authorizeRoles("superadmin", "admin"),
  upload.single("productImg"),
  createProductsWithCategory
); // Create a product with category (Admin/Superadmin only)

// Sorting Routes
router.route("/priceLowHigh").get(sortPriceLowToHigh); // Sort products by price (Low to High)
router.route("/priceHighLow").get(sortPriceHighToLower); // Sort products by price (High to Low)
router.route("/newest").get(sortNewest); // Sort products by newest first

// Get All Products
router.route("/get-products").get(getAllProducts); // Retrieve all products

// Get Single Product
router.route("/get-single-product/:productId").get(authMiddleware, getSingleProduct); // Fetch details of a single product by ID

// Update Product
router.route("/product/update/:productid").patch(
  authMiddleware,
  authorizeRoles("superadmin", "admin"),
  upload.single("productImg"),
  updateProductWithCategory
); // Update a product (Admin/Superadmin only)

// Category List
router.route("/categoryList").post(categoryList); // Create a category list

// Delete Product
router.route("/product/delete/:productid").delete(
  authMiddleware,
  authorizeRoles("superadmin", "admin"),
  deleteProductWithCategory
); // Delete a product (Admin/Superadmin only)

// Order Routes
router.route("/order").post(authMiddleware, createOrder); // Create an order
router.route("/order/update/:orderId").patch(authMiddleware, updateOrder); // Update an order
router.route("/get-order/:productId").get(authMiddleware,getOrder); // get  an product  order
router.route("/order/delete/:orderId").delete(authMiddleware, deleteOder); // Delete an order

// Address Routes
router.route("/address").post(authMiddleware,
  body("phone").isMobilePhone().withMessage("Invalid phone number"),
  addressController
); // Add an address
router.route("/find-address").get(authMiddleware,findAddress) //find user address

// Cart Routes
router.route("/createCart").post(authMiddleware, createCart); // Add an item to the cart

// Review Routes
router.route("/review/:productId").post(authMiddleware, reviewController); // Add a review for a product
router.route("/update/:productId").patch(authMiddleware, updateReview); // Update a review
router.route("/delete/:productId").delete(authMiddleware, deleteReview); // Delete a review

// Money Transfer Route
router.route("/transferMoney").post(authMiddleware, transferMoney); // Transfer money (user action)

// Verify Email Route
router.route("/verify-email").post(authMiddleware, verifyEmail); // Verify user's email






export { router }