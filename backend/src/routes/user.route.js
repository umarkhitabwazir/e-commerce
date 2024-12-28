import { Router } from "express";
import { createUser, loginUser, logoutUser, verifyEmail } from "../controllers/User.controller.js";
import { createProducts } from "../controllers/Product.controller.js";
import { body, validationResult } from "express-validator";
import { ApiError } from "../utils/apiError.js";
import twilio from "twilio";
import dotenv from "dotenv";
import { authMiddleware } from "../middleWare/auth.Middle.js";

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
router.route("/user/logout").post(authMiddleware, logoutUser)
router.route("/product/create").post(authMiddleware, createProducts)

router.route("/verify-email").post(authMiddleware, verifyEmail);






export { router }