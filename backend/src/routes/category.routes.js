import { allcategoryList,categoryList } from "../controllers/CategoryList.controller.js";

import express from "express";
const categoryRouter = express.Router();
categoryRouter.route("/all-category-list").get(allcategoryList); // Create a category list
categoryRouter.route("/categoryList").post(categoryList); // Create a category list


export default categoryRouter;