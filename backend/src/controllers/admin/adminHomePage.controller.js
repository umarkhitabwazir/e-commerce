// controllers/adminHomePage.controller.js

import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { User } from "../../models/User.model.js";
import { Product } from "../../models/product.model.js";
import { Order } from "../../models/Order.model.js";
import SellerRequest from "../../models/storeRequests.model.js";
import { ApiError } from "../../utils/apiError.js";

export const adminHomePageController = asyncHandler(async (req, res) => {
  try {
    const [totalSellers, totalBuyers, totalProducts, totalOrders, pendingStores] =
      await Promise.all([
        User.countDocuments({ role: "seller" }),
        User.countDocuments({ role: "buyer" }),
        Product.countDocuments(),
        Order.countDocuments(),
        SellerRequest.countDocuments({ status: "pending" }),
      ]);

    // total revenue from completed orders
    const revenueResult = await Order.aggregate([
      { $match: { isDelivered: true } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;

    return res
      .status(200)
      .json(
        new ApiResponse(200, {
          totalSellers,
          totalBuyers,
          totalProducts,
          totalOrders,
          totalRevenue,
          pendingStores,
        })
      );
  } catch (error) {
    console.error("Admin dashboard fetch error:", error);
    return res
      .status(500)
      .json(ApiError(500, "Failed to load admin dashboard data"));
  }
});
