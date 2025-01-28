import { Product } from "../models/Product.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";



let adminProducts = asyncHandler(async (req, res) => {
    let user = req.user
    if (!user) {
        throw new ApiError(401, false, "user not loged in!", false)
    }
    let userRole = user.role
    let role = ["superadmin", "admin"]
    if (!role.includes(userRole)) {
        throw new ApiError(401, false, "you can't access secure route", false)

    }
    let product = await Product.find({ user: user.id })
    if (!product) {
        throw new ApiError(404, false, "no product founded", false)

    }
    res.status(200).json(new ApiResponse(200, product, "product founded", true))
})

export { 

    adminProducts,

}