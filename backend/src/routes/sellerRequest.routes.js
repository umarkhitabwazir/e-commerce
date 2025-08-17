import { Router } from "express";
import { sellerRequest } from "../controllers/sellerRequest.controller.js";

const sellerRequestRoutes = Router()

sellerRequestRoutes.route('/seller-request').post(sellerRequest)

export default sellerRequestRoutes