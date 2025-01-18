import { Router } from "express";
import { authMiddleware } from "../middleWare/auth.Middle.js";
import { authorizeRoles } from "../middleWare/authorizeRoles.middle.js";
import { adminProducts } from "../controllers/adminDashboard.controller.js";
import { upload } from "../middleWare/multer.middle.js";
import { createProductsWithCategory, deleteProductWithCategory, updateProductWithCategory } from "../controllers/Product.controller.js";

let adminRouter = Router()
adminRouter.route("/admin-products").get(authMiddleware, adminProducts)

adminRouter.route("/product/create").post(
    authMiddleware,
    authorizeRoles("superadmin", "admin"),
    upload.single("productImg"),
    createProductsWithCategory
); // Create a product with category (Admin/Superadmin only)

// Update Product
adminRouter.route("/product/update/:productid").patch(
    authMiddleware,
    authorizeRoles("superadmin", "admin"),
    upload.single("productImg"),
    updateProductWithCategory
  ); // Update a product (Admin/Superadmin only)

  // Delete Product
adminRouter.route("/product/delete/:productid").delete(
    authMiddleware,
    authorizeRoles("superadmin", "admin"),
    deleteProductWithCategory
  ); // Delete a product (Admin/Superadmin only)
  
  
export { adminRouter }