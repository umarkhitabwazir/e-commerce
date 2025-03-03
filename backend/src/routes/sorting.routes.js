import express from "express";
import { sortPriceLowToHigh, sortPriceHighToLower, sortNewest } from "../controllers/SortBy.js";

export let sortingRouters = express.Router();

// Sorting Routes
sortingRouters.route("/priceLowHigh").get(sortPriceLowToHigh); // Sort products by price (Low to High)
sortingRouters.route("/priceHighLow").get(sortPriceHighToLower); // Sort products by price (High to Low)
sortingRouters.route("/newest").get(sortNewest); // Sort products by newest first

