import express from "express";
import { getAllProducts,  getSingleProduct, searchProduct } from "../controllers/Product.controller.js";

export const productRouter = express.Router();

// Get All Products
productRouter.route("/search-products").get(searchProduct); // search products
productRouter.route("/get-products").get(getAllProducts); // Retrieve all products

// Get Single Product
productRouter.route("/get-single-product/:productId").post( getSingleProduct); // Fetch details of a single product by ID







