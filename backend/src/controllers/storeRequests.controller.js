import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import SellerRequest from "../models/storeRequests.model.js";
import { sendSellerRequestEmail } from "../utils/emailSenders/sendSellerRequestEmail.js"
import { User } from "../models/User.model.js";



const sellerRequest = asyncHandler(async (req, res) => {
  const { storeName, phone, ownerName, email, description } = req.body;

  // Validate required fields
  if (!storeName || !phone || !ownerName || !email || !description) {
    throw new ApiError(401, "All fields are required!");
  }

  // Check if store name already exists
  const existingStore = await SellerRequest.findOne({ storeName });
  console.log('existingstore',existingStore)
  if (existingStore && existingStore.status==="approved") {
    throw new ApiError(400, `The store name "${storeName}" is already in use.`);
  }


  // Check if email belongs to an existing user
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    if (existingUser.role === "seller" && existingUser.status==='approved') {
      throw new ApiError(400, `This email ${email} already belongs to a seller.`);
    }
    if (existingUser.role === "super-admin") {
      throw new ApiError(400, `This email ${email} belongs to an admin account.`);
    }
  }
  // Check if email already submitted a seller request
  const existingRequest = await SellerRequest.findOne({ email });

  switch (existingRequest.status) {
    case "approved":
      throw new ApiError(400, "Your store is already approved. You can log in to your account.");
    case "pending":
      throw new ApiError(400, "Your store request is still under review. Please wait for admin approval.");
    case "rejected":
      await SellerRequest.updateOne(
        { email: existingRequest.email },
        {
          description,
          storeName,
          phone,
          ownerName
        }
      );
     return res.status(201).json(new ApiResponse(201, {}));
   
    default:
      throw new ApiError(400, "Invalid store status.");
  }

  // Create new seller request
  const createRequest = await SellerRequest.create({
    storeName,
    ownerName,
    phone,
    email,
    description,
  });

  const submissionDate = new Date();

  sendSellerRequestEmail(
    storeName,
    ownerName,
    email,
    submissionDate,
    createRequest._id,
    phone
  );

  res.status(201).json(new ApiResponse(201, createRequest));
});



export {
  sellerRequest
}