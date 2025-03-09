import { allcategoryList,categoryList, findCategoryProduct } from "../controllers/CategoryList.controller.js";

import express from "express";
const categoryRouter = express.Router();
categoryRouter.route("/all-category-list").get(allcategoryList); // Create a category list
categoryRouter.route("/categoryList").post(categoryList); // Create a category list
categoryRouter.route("/find-Category-Products").post(findCategoryProduct); //find Category Products


export default categoryRouter;