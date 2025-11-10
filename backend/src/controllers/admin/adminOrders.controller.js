import { Order } from "../../models/Order.model.js"
import { ApiResponse } from "../../utils/apiResponse.js"
import { ApiError } from "../../utils/apiError.js"
import mongoose from "mongoose"
import { Product } from "../../models/Product.model.js"
import { User } from "../../models/User.model.js"

export const getAllOrdersForAdmin = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("userId", "username email")
      .populate("products.productId", "title price")
      .sort({ createdAt: -1 })

    return res
      .status(200)
      .json(new ApiResponse(200, orders, "All platform orders fetched successfully"))
  } catch (error) {
    next(error)
  }
}


export const getSingleOrderByAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
  throw new ApiError(400, "Order ID is required");
}
const objectId = new mongoose.Types.ObjectId(id);

const order = await Order.findById(objectId)
  .populate({
    path: "userId",
    select: "username email"
  })
  .populate({
    path: "products.productId",
    select: "title price image user",
    populate: {
      path: "user",
      select: "username email"
    }
  });

      

    if (!order) {
      throw new ApiError(404, "Order not found");
    }
    res
      .status(200)
      .json(new ApiResponse(200, order, "Order fetched successfully"));
  } catch (error) {
    next(error);
  }
};


export const deleteOrderByAdmin = async (req, res, next) => {
  try {
    const { id } = req.params
    const order = await Order.findById(id)

    if (!order) throw new ApiError(404, "Order not found")

    await Order.findByIdAndDelete(id)

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Order deleted by admin successfully"))
  } catch (error) {
    next(error)
  }
}
