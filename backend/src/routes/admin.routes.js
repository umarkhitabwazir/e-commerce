import { Router } from "express";
import { authMiddleware } from "../middleWare/auth.Middle.js";
import { authorizeRoles } from "../middleWare/authorizeRoles.middle.js";
import { adminProducts,getOrdersByAdminProducts, orderConfirmed, orderDelivered, orderPickedByCounter, orderReadyForPickUp, updateProductWithCategory, orderShipping, paymentConfirmed } from "../controllers/adminDashboard.controller.js";
import { upload } from "../middleWare/multer.middle.js";
import { createProductsWithCategory, deleteProductWithCategory } from "../controllers/Product.controller.js";

const adminRouter = Router()
adminRouter.route("/admin-products").get(authMiddleware, adminProducts)

adminRouter.route("/product/create").post(
    authMiddleware,
    authorizeRoles("superadmin", "admin"),
    upload.single("productImg"),
    createProductsWithCategory
); 

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
  adminRouter.route('/admin/get-ordered-products').get(
    authMiddleware,
    authorizeRoles('admin'),
    getOrdersByAdminProducts
  )
  adminRouter.route("/order-confirmation/:orderId").patch(authMiddleware, authorizeRoles("admin"),orderConfirmed )
  adminRouter.route("/payment-confirmation/:orderId").patch(authMiddleware, authorizeRoles("admin"),paymentConfirmed )
  adminRouter.route("/order-shipping/:orderId").patch(authMiddleware, authorizeRoles("admin"),orderShipping)
  adminRouter.route("/orderReadyForPickUp/:orderId").patch(authMiddleware, authorizeRoles("admin"),orderReadyForPickUp)
  adminRouter.route("/order-delivered/:orderId").patch(authMiddleware, authorizeRoles("admin"),orderDelivered)
  adminRouter.route("/orderPickedByCounte/:orderId").patch(authMiddleware, authorizeRoles("admin"),orderPickedByCounter)
export { adminRouter }