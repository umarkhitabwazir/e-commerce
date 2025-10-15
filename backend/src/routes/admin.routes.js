import { Router } from "express";
import { authMiddleware } from "../middleWare/auth.Middle.js";
import { authorizeRoles } from "../middleWare/authorizeRoles.middle.js";
import {
  adminProducts, getOrdersByAdminProducts,
  orderConfirmed, orderDelivered,
  orderPickedByCounter, orderReadyForPickUp,
  createProductsWithCategory,
  updateProductWithCategory, orderShipping,
  paymentConfirmed, deleteProductWithCategory
} from "../controllers/adminDashboard.controller.js";
import { upload } from "../middleWare/multer.middle.js";


const adminRouter = Router()
adminRouter.route("/admin-products")
  .get(authMiddleware, adminProducts)

adminRouter.route("/product/create")
  .post(
    authMiddleware,
    authorizeRoles('seller'),
    upload.single("productImg"),
    createProductsWithCategory
  );

// Update Product
adminRouter.route("/product/update/:productid")
  .patch(
    authMiddleware,
    authorizeRoles('seller'),
    upload.single("productImg"),
    updateProductWithCategory
  ); // Update a product (Admin/Superadmin only)

// Delete Product
adminRouter.route("/product/delete/:productid")
  .delete(
    authMiddleware,
    authorizeRoles('seller'),

    deleteProductWithCategory
  ); // Delete a product (Admin/Superadmin only)
adminRouter.route('/admin/get-ordered-products')
  .get(
    authMiddleware,
    authorizeRoles('seller'),
    getOrdersByAdminProducts
  )
adminRouter.route("/order-confirmation/:orderId")
  .patch(
    authMiddleware,
    authorizeRoles('seller'),
    orderConfirmed
  )
adminRouter.route("/payment-confirmation/:orderId")
  .patch(
    authMiddleware, authorizeRoles("seller"), paymentConfirmed)
adminRouter.route("/order-shipping/:orderId")
  .patch(authMiddleware,
    authorizeRoles('seller'),
    orderShipping)
adminRouter.route("/orderReadyForPickUp/:orderId")
  .patch(authMiddleware,
    authorizeRoles('seller'),
    orderReadyForPickUp)
adminRouter.route("/order-delivered/:orderId")
  .patch(authMiddleware,
    authorizeRoles('seller'),
    orderDelivered)
adminRouter.route("/orderPickedByCounte/:orderId")
  .patch(authMiddleware,
    authorizeRoles('seller'),
    orderPickedByCounter)
export { adminRouter }