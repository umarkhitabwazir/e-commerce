import { Router } from "express";
import { createUser, verifyEmail } from "../controllers/User.controller.js";
import nodemailer from "nodemailer";
import { body, validationResult } from "express-validator";
import { ApiError } from "../utils/apiError.js";
import twilio from "twilio";
import dotenv from "dotenv";
import { authMiddleware } from "../middleWare/auth.Middle.js";

dotenv.config({
    path:".env"

})






let router = Router()
router.route("/user/signup").post(
[
  body("email").isEmail().withMessage("Invalid email address"),
body("phone").isMobilePhone().withMessage("Invalid phone number"),

],
  createUser)


router.route("/verify-email").post(authMiddleware,verifyEmail);






export { router }