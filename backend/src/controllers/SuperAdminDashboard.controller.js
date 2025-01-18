import { User } from "../models/User.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

let listAllUsers = asyncHandler(async (req, res) => {
    let user = req.user
    const users = await User.find({ role: { $ne: "superadmin" } }).select("-password")
    console.log("users", user)
    if (!user) {
        throw new ApiError(404, "Users not found")
    }
    let listAllUsers = users.map((user) => {
        return {
            id: user.id,
            username: user.username,
            email: user.email,

        }
    })
    res.status(200).json(new ApiResponse(200, listAllUsers, "All users fetched successfully"))

    // if (!user) {
    //     throw new ApiError(401, "Unauthorized. Please log in first.")
    // }

    // if (user.role === "superadmin") {
    //     throw new ApiError(401, "you can't delete superadmin account")
    // }




    // let isVerified = user.isVerified
    // if (!isVerified) {
    //     throw new ApiError(401, "delete account after email verification")
    // }
    // let isUser = user.role === "user"
    // if (isUser) {
    //     throw new ApiError(401, "only Admin  can delete account")

    // }

    // let findProduct = await Product.find({ user: user.id })

    // if (findProduct) {
    //     await Product.deleteMany({ user: user.id })
    // }
    // let findCategory = await Category.find({ user: user.id })
    // if (findCategory) {
    //     await Category.deleteMany({ user: user.id })
    // }

    // let findCart = await Cart.find({ user: user.id })
    // if (findCart) {
    //     await Cart.deleteMany({ user: user.id })
    // }
    // let findOrder = await Order.find({ user: user.id })
    // if (findOrder) {
    //     await Order.deleteMany({ user: user.id })
    // }
    // let findReview = await Review.find({ user: user.id })
    // if (findReview) {
    //     await Review.deleteMany({ user: user.id })
    // }
    // let findMoneyTransfer = await MoneyTransfer.find({ user: user.id })
    // if (findMoneyTransfer) {
    //     await MoneyTransfer.deleteMany({ user: user.id })

    // }

    // let deleteUser = await User.findOneAndDelete(user.id)
    // if (!deleteUser) {
    //     throw new ApiError(404, "User not found")
    // }

    res.status(200).json(new ApiResponse(200, deleteUser, "User deleted successfully"))
})

export {listAllUsers}