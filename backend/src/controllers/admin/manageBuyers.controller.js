import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

// Get all buyers
export const getAllBuyers = async (req, res, next) => {
  try {
    const buyers = await User.find({ role: "buyer" }).select("-password");
    return res
      .status(200)
      .json(new ApiResponse(200, buyers, "Buyers fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const approvedBuyer = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const buyer = await User.findById(id);

    if (!buyer || buyer.role !== "buyer") {
      throw new ApiError(404, "Buyer not found");
    }

    buyer.status = "approved";
    await buyer.save();

    return res
      .status(200)
      .json(new ApiResponse(200, buyer, "Buyer approved successfully"));
  } catch (error) {
    next(error);
  }
}

)

// Block or disable a buyer
export const blockBuyer = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const buyer = await User.findById(id);

    if (!buyer || buyer.role !== "buyer") {
      throw new ApiError(404, "Buyer not found");
    }

    buyer.status = "blocked";
    await buyer.save();

    return res
      .status(200)
      .json(new ApiResponse(200, buyer, "Buyer blocked successfully"));
  } catch (error) {
    next(error);
  }
})

// Delete a buyer
export const deleteBuyer = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const buyer = await User.findById(id);

    if (!buyer || buyer.role !== "buyer") {
      throw new ApiError(404, "Buyer not found");
    }

    await buyer.deleteOne();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Buyer deleted successfully"));
  } catch (error) {
    next(error);
  }
})
