
import { Order } from "../../../models/Order.model.js";

export const getMonthlyRevenueTrend = async (req, res, next) => {
  try {
    const revenueData = await Order.aggregate([
      {
        $match: {
          isPaid: true,
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
      {
        $sort: { "_id": 1 },
      },
    ]);

    const formatted = revenueData.map((item) => ({
      month: new Date(0, item._id - 1).toLocaleString("default", { month: "short" }),
      revenue: item.totalRevenue,
    }));

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
};
