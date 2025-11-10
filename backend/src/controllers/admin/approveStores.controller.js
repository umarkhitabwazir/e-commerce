import bcrypt from "bcryptjs/dist/bcrypt.js"
import SellerRequest from "../../models/storeRequests.model.js"
import { ApiError } from "../../utils/apiError.js"
import { ApiResponse } from "../../utils/apiResponse.js"
import { User } from "../../models/User.model.js"
import { sellerApprovalEmailSender } from "../../utils/emailSenders/sellerApprovalEmailSender.js"
import { sellerRejectionEmailSender } from "../../utils/emailSenders/sellerRejectionEmailSender.js"

// Get all store requests
export const getAllStoreRequests = async (req, res, next) => {
  try {
    const requests = await SellerRequest.find()
    return res
      .status(200)
      .json(new ApiResponse(200, requests, "Fetched all store requests"))
  } catch (error) {
    next(error)
  }
}

// Approve store request
export const approveStore = async (req, res, next) => {
  try {
    const { id } = req.params

    const store = await SellerRequest.findById(id)
    const randomPassword = Math.random().toString(36).slice(-8)
    const hashedPassword = await bcrypt.hash(randomPassword, 10)

    if (!store) throw new ApiError(404, "Store not found")

    store.status = "approved"
    await store.save()
    // check if user already exists
    const existingUser = await User.findOne({ email: store.email })

    if (existingUser) {
      await User.updateOne(
        { email: store.email },
        {
          $set: {
            role: "seller",
            status: "approved",
            password: hashedPassword,
            isVerified: true
          },
        }
      );



    } else {
      // create seller account


      await User.create({
        username: store.ownerName,
        email: store.email,
        phone: store.phone,
        password: hashedPassword,
        isVerified: true,
        role: "seller",
        status: "approved",
      })

    }
    await sellerApprovalEmailSender(store.ownerName, store.email, randomPassword)

    return res
      .status(200)
      .json(new ApiResponse(200, store, "Store approved successfully"))
  } catch (error) {
    next(error)
  }
}

// Reject store request
export const rejectStore = async (req, res, next) => {
  try {
    const { id } = req.params
    const store = await SellerRequest.findById(id)

    if (!store) throw new ApiError(404, "Store not found")

    
    const existingUser = await User.findOne({ email: store.email })
    if (existingUser && existingUser.role==="seller") {
      await User.updateOne(
        { email: store.email },
        {
          $set: {
            role: "seller",
            status: "suspended",
            isVerified: true
          }
        }
      );
    }
    store.status = "rejected"
    await store.save()
await sellerRejectionEmailSender(store.email,store.ownerName)
    return res
      .status(200)
      .json(new ApiResponse(200, store, "Store rejected successfully"))
  } catch (error) {
    next(error)
  }
}
