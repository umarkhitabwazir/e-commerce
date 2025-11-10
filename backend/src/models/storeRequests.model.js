import mongoose, { Schema } from "mongoose";

const sellerRequestSchema = new Schema({
  storeName: String,
  ownerName: String,
  email: String,
  description: String,
  phone: {
    type: String,
    required: [true, "phone is required"],
    trim: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", 'rejected'],
    default: "pending",
  },
});

const SellerRequest = mongoose.model("SellerRequest", sellerRequestSchema);
export default SellerRequest