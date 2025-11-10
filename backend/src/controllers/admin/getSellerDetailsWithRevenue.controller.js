import { User } from "../../models/User.model.js";
import { Product } from "../../models/product.model.js";
import { Order } from "../../models/Order.model.js";
import mongoose from "mongoose";
import { ApiResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const getSellerDetailsWithRevenue =asyncHandler( async (req, res) => {
  try {
    const { id } = req.params;
const objectId=new mongoose.Types.ObjectId(id)
    const seller = await User.findById(objectId).select("username email storeName isVerified");
    if (!seller) throw new ApiError("Seller not found" )

    // Fetch seller products
   const products = await Product.find({ user: objectId }).select("title price countInStock image");


    // Calculate total revenue (from orders containing this seller’s products)
    const orders = await Order.aggregate([
      { $unwind: "$products" },
      {
        $lookup: {
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      { $match: { "productDetails.user": seller._id, isPaid: true } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ]);
    const totalRevenue = orders[0]?.totalRevenue || 0;

    const investment = products.reduce((total, p) => total + p.countInStock * p.price, 0)


const data={seller,products,totalRevenue,investment}
    res.status(200).json(new ApiResponse(200,data)
      
    
    );
  } catch (error) {
    console.log('getSellerDetailsWithRevenue',error)
  }
})
