import express from "express";
import { body } from "express-validator";
import { addressController, findAddress } from "../controllers/Address.controller.js";
import { authMiddleware } from "../middleWare/auth.Middle.js";

export const addressRouters = express.Router();


// Address Routes
addressRouters.route("/address").post(authMiddleware,
    body("phone").isMobilePhone().withMessage("Invalid phone number"),
    addressController
  );
   // Add an address
  addressRouters.route("/find-address").get(authMiddleware,findAddress) //find user address
  