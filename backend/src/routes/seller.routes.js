import { Router } from "express";
import { authMiddleware } from "../middleWare/auth.Middle.js";
import { authorizeRoles } from "../middleWare/authorizeRoles.middle.js";
import {
  sellerProducts,
  orderConfirmed, orderDelivered,
  orderPickedByCounter, orderReadyForPickUp,
  createProductsWithCategory,
  updateProductWithCategory, orderShipping,
  paymentConfirmed, deleteProductWithCategory,
  getOrdersBySellerProducts
} from "../controllers/sellerDashboard.controller.js";
import { upload } from "../middleWare/multer.middle.js";


const sellerRouter = Router()

sellerRouter.route("/seller-products")
  .get(authMiddleware, sellerProducts)

sellerRouter.route("/product/create")
  .post(
    authMiddleware,
    authorizeRoles('seller'),
    upload.single("productImg"),
    createProductsWithCategory
  )

sellerRouter.route("/product/update/:productid")
  .patch(
    authMiddleware,
    authorizeRoles('seller'),
    upload.single("productImg"),
    updateProductWithCategory
  )

sellerRouter.route("/product/delete/:productid")
  .delete(
    authMiddleware,
    authorizeRoles('seller'),
    deleteProductWithCategory
  )

sellerRouter.route('/seller/get-ordered-products')
  .get(
    authMiddleware,
    authorizeRoles('seller'),
   getOrdersBySellerProducts
  )

sellerRouter.route("/order-confirmation/:orderId")
  .patch(
    authMiddleware,
    authorizeRoles('seller'),
    orderConfirmed
  )

sellerRouter.route("/payment-confirmation/:orderId")
  .patch(
    authMiddleware, authorizeRoles("seller"), paymentConfirmed)

sellerRouter.route("/order-shipping/:orderId")
  .patch(authMiddleware,
    authorizeRoles('seller'),
    orderShipping)

sellerRouter.route("/orderReadyForPickUp/:orderId")
  .patch(authMiddleware,
    authorizeRoles('seller'),
    orderReadyForPickUp)

sellerRouter.route("/order-delivered/:orderId")
  .patch(authMiddleware,
    authorizeRoles('seller'),
    orderDelivered)

sellerRouter.route("/orderPickedByCounte/:orderId")
  .patch(authMiddleware,
    authorizeRoles('seller'),
    orderPickedByCounter)

export { sellerRouter }
