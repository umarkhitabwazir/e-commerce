import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/apiError.js";
import {User} from "../../models/User.model.js";

// Get all sellers
export const getAllSellers = asyncHandler(async (req, res) => {
  const sellers = await User.find({ role: "seller" }).select(
    "username email storeName status"
  );
  return res
    .status(200)
    .json(new ApiResponse(200, sellers , "All sellers fetched successfully"));
});

// Update seller status (approve, block, etc.)
export const updateSellerStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status)
    throw new ApiError(400, "Status field is required");

  const seller = await User.findOne({ _id: id, role: "seller" });
  if (!seller)
    throw new ApiError(404, "Seller not found");

  seller.status = status;
   await seller.save();

  return res
    .status(200)
    .json(new ApiResponse(200, seller, "Seller status updated successfully"));
});
