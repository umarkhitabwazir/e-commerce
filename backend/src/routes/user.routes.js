import { Router } from "express";
import {
  createUser, loginUser, logoutUser, verifyEmail, updateUser,
  resendEmailVerificationCode,
  getLoginUserData,
  forgotPassword,
  resetPassword
} from "../controllers/User.controller.js";

import { createCart } from "../controllers/Cart.controller.js";
import { transferMoney } from "../controllers/MoneyTransfer.controller.js";
import { body, } from "express-validator";

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

// forgotPassword Route
userRouter.route("/forgotPassword").post(
  [
    body("email").isEmail().withMessage("Invalid email address"),
  ],
  forgotPassword
); 

//restPassword Route
userRouter.route("/resetPassword").post(resetPassword);

// Resend Verification Code
userRouter.route("/resendVerificationCode").post(authMiddleware, resendEmailVerificationCode); // Resend verification code for email

// Logout Route
userRouter.route("/user/logout").post(authMiddleware, logoutUser); // Logout user

// Update User
userRouter.route("/updateUser").patch(authMiddleware, updateUser); // Update user details



// Get Logged-in User
userRouter.route("/get-logined-user").get(authMiddleware, getLoginUserData); // Fetch data of the logged-in user








// Cart Routes
userRouter.route("/createCart").post(authMiddleware, createCart); // Add an item to the cart


// Money Transfer Route
userRouter.route("/transferMoney").post(authMiddleware, transferMoney); // Transfer money (user action)

// Verify Email Route
userRouter.route("/verify-email").post(authMiddleware, verifyEmail); // Verify user's email






export { userRouter }