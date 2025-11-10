import {Order} from "../../models/Order.model.js";


export const getRecentOrders = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const orders = await Order.find({})
      .populate({
        path: "userId",
        select: "username email"
      })
      .populate({
        path: "products.productId",
        select: "title price image"
      })
      .sort({ createdAt: -1 })
      .limit(limit);


    res.status(200).json({
      success: true,
      message: "Recent orders fetched successfully",
      data: orders
    });
  } catch (error) {
    next(error);
  }
};
