import { Router } from "express";
import { contactUs } from "../controllers/contactUs.controller.js";

export const contactUsRouter=Router()
contactUsRouter.route('/contact-us').post(contactUs)