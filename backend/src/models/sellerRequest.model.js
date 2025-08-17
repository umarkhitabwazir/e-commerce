import mongoose, { Schema } from "mongoose";

const sellerRequestSchema = new Schema({
  storeName: String,
  ownerName: String,
  email: String,
  description: String,
  status: { type: String, default: "pending" },
});

const SellerRequest = mongoose.model("SellerRequest", sellerRequestSchema);
export default  SellerRequest