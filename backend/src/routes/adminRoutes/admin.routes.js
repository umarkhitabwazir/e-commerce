import { Router } from "express";
import { adminHomePageController } from "../../controllers/admin/adminHomePage.controller.js";
import {authMiddleware} from "../../middleWare/auth.Middle.js"
import {authorizeRoles} from "../../middleWare/authorizeRoles.middle.js"
import {adminRole} from "../../config/roles.config.js"
import { getAllSellers, updateSellerStatus } from "../../controllers/admin/manageSellers.controller.js";
import { getAllStoreRequests,approveStore,rejectStore } from "../../controllers/admin/approveStores.controller.js";
import { getAllBuyers,blockBuyer,deleteBuyer, approvedBuyer } from "../../controllers/admin/manageBuyers.controller.js";
import { getAllOrdersForAdmin,getSingleOrderByAdmin } from "../../controllers/admin/adminOrders.controller.js";
import { getRecentOrders } from "../../controllers/admin/getRecentOrders.controller.js";
import { getMonthlyRevenueTrend } from "../../controllers/admin/revenue/monthlyRevenueTrend.controller.js";
import { getSellerDetailsWithRevenue } from "../../controllers/admin/getSellerDetailsWithRevenue.controller.js";

export const adminRoutes=Router()

adminRoutes.route("/admin/dasboard").get(authMiddleware,authorizeRoles(adminRole),adminHomePageController)
adminRoutes.route("/admin/revenue/monthly").get(authMiddleware,authorizeRoles(adminRole),getMonthlyRevenueTrend)

// admin sellers
adminRoutes.route("/admin/sellers").get(authMiddleware,authorizeRoles(adminRole),getAllSellers)
adminRoutes.route("/admin/sellers/:id").patch(authMiddleware,authorizeRoles(adminRole),updateSellerStatus)
adminRoutes.route("/admin/seller/revenue/:id").get(authMiddleware,authorizeRoles(adminRole),getSellerDetailsWithRevenue)
adminRoutes.route("/admin/seller-requests").get(authMiddleware,authorizeRoles(adminRole),getAllStoreRequests)
adminRoutes.route("/admin/approve-seller-requests/:id").put(authMiddleware,authorizeRoles(adminRole),approveStore)
adminRoutes.route("/admin/reject-seller-requests/:id").put(authMiddleware,authorizeRoles(adminRole),rejectStore)

//admin buyers
adminRoutes.route("/admin/buyers").get(authMiddleware,authorizeRoles(adminRole),getAllBuyers)
adminRoutes.route("/admin/approve-buyer/:id").put(authMiddleware,authorizeRoles(adminRole),approvedBuyer)
adminRoutes.route("/admin/block-buyer/:id").put(authMiddleware,authorizeRoles(adminRole),blockBuyer)
adminRoutes.route("/admin/delete-buyer/:id").put(authMiddleware,authorizeRoles(adminRole),deleteBuyer)

// admin orders
adminRoutes.route("/admin/orders").get(authMiddleware,authorizeRoles(adminRole),getAllOrdersForAdmin)
adminRoutes.route("/admin/recent-orders").get(authMiddleware,authorizeRoles(adminRole),getRecentOrders)
adminRoutes.route("/admin/view-single-order/:id").get(authMiddleware,authorizeRoles(adminRole),getSingleOrderByAdmin)