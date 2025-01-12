import { User } from "../models/User.model.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { ApiError } from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { body, validationResult } from "express-validator";
import nodemailer from "nodemailer";
import axios from "axios"
import dotenv from "dotenv"
import { MoneyTransfer } from "../models/moneyTranser.model.js";
import { Product } from "../models/Product.model.js";
import { Cart } from "../models/Cart.model.js";
import { Order } from "../models/Order.model.js";
import { Review } from "../models/Review.model.js";
import { Category } from "../models/Category.model.js";
dotenv.config({
    path: ".env"
})

let generateAccessAndRefereshTokens = async (userId) => {
    try {
        let user = await User.findById(userId)
        if (!user) {
            throw new ApiError(404, "User not found")
        }
        let accessToken = await user.generateAccessToken()
        let refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken

        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token", error)
    }
}

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "umairkhitab0308@gmail.com",
        pass: "segi polt qkkt ctxi",
    },
    logger: true,
    debug: true,
});

let sendEmail = async (email, emailVerificationCode) => {
    const mailOptions = {
        from: '"E-commerce Shop 🛒🛍" <umairkhitab0308@gmail.com>',
        to: email,
        subject: "Email Verification",
        text: `Your verification code is: ${emailVerificationCode}`,
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Failed to send email:", error);
                return reject(new ApiError(500, "Failed to send email"));
            }
            resolve(info);
        });
    });
};


// this is for email varification and workable ,but out of credits not able to check

// const verifyEmailWithZeroBounce = async (email) => {
//     const apiKey = process.env.ZEROBOUNCE_API_KEY;
//     console.log("apiKey",apiKey)
//     const url = `https://api.zerobounce.net/v2/validate?api_key=${apiKey}&email=${email}`;
//     try {
//         const response = await axios.get(url);
//         console.log("response.data",response.data)
//         return response.data.status === "valid"; // Returns true if valid, false otherwise
//     } catch (error) {
//         console.error("Error validating email:", error);
//         throw new ApiError(500, "Failed to validate email.");
//     }
// };

let createUser = asyncHandler(async (req, res) => {
    let { username, email, fullName, role, address, phone, password } = req.body


    if ([username, email, fullName, phone, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(400, errors.array()[0].msg);
    }

    // if (!["user", "admin", "superadmin"].includes(role)) {
    //         throw new ApiError(400, "Role must be user or admin")

    //     }

    if (role === "superadmin") {
        throw new ApiError(400, "you only create user and admin role! ")
    }

    let exitUser = await User.findOne({
        $or: [{ username: username }, { email: email }]
    })

    if (exitUser) {
        throw new ApiError(400, "User username or email already exists")
    }
    const emailVerificationCode = Math.floor(100000 + Math.random() * 900000);
    await sendEmail(email, emailVerificationCode)


    let user = new User({
        username,
        email,
        fullName,
        role,
        address,
        phone,
        password,
        emailVerificationCode,


    })

    await user.save()
    let options = {
        httponly: true,
        secure: true,
    }
    let { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)


    res.
        cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options).
        status(201).json(new ApiResponse(201, user, "User created successfully, Please verify your email.")
        )




})

let updateUser = asyncHandler(async (req, res) => {
    let user = req.user
    let { fullName, address, phone } = req.body
    if (!user.id) {
        throw new ApiError(401, "Unauthorized. Please log in first.")
    }
    if ([fullName, address, phone].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    user.fullName = fullName
    user.address = address
    user.phone = phone
    await user.save()
    res.status(201).json(new ApiResponse(201, user, "User updated successfully"))
})

let listAllUser = asyncHandler(async (req, res) => {
    let user = req.user
    const users = await User.find({ role: { $ne: "superadmin" } }).select("-password")
    console.log("users", users)
    if (!users) {
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

let loginUser = asyncHandler(async (req, res) => {
    let { email, password } = req.body
    if (!email || !password) {
        throw new ApiError(400, "Email and password are required")
    }
    let user = await User.findOne({ email: email })
    let options = {
        httponly: true,
        secure: true,
    }
    let { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)
    if (!user) {
        throw new ApiError(404, "User not found")
    }
    let isMatch = await user.comparePassword(password)
    if (!isMatch) {
        throw new ApiError(400, "Invalid password")
    }
    let isVerified = user.isVerified
    if (!isVerified) {
        const emailVerificationCode = Math.floor(100000 + Math.random() * 900000);
        await sendEmail(email, emailVerificationCode)
        user.emailVerificationCode = emailVerificationCode
        await user.save()

        res.
            cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options).
            status(200).json(new ApiResponse(200, null, "Email is not verified. Verification code has been sent to your email.", false)
            )
    }

if (isVerified) {
    res.
        cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options).
        status(200).json(new ApiResponse(200, user, "user loged in successfully!", true)
        )
}
    

})

let logoutUser = asyncHandler(async (req, res) => {
    let user = req.user

    if (!user) {
        throw new ApiError(404, "User not not logged in")
    }
    user.refreshToken = ""
    await user.save({ validateBeforeSave: false })
    res.clearCookie("accessToken")
    res.clearCookie("refreshToken")
    res.status(200).json(new ApiResponse(200, null, "User logged out successfully"))
})

let verifyEmail = asyncHandler(async (req, res) => {
    const { emailVerificationCode } = req.body;
    console.log("emailVerificationCode", emailVerificationCode)

    if (!emailVerificationCode) {
        throw new ApiError(400, "Verification code is required.");
    }

    let user = req.user;
    if (!user) {
        throw new ApiError(401, "Unauthorized. Please log in first.");
    }



    if (user.isVerified) {
        throw new ApiError(400, "Email is already verified.");
    }

    if (user.emailVerificationCode !== parseInt(emailVerificationCode)) {
        throw new ApiError(400, "Invalid verification code.");
    }

    user.isVerified = true;
    user.emailVerificationCode = null;

    await generateAccessAndRefereshTokens(user._id);
    await user.save();


    res.status(200).json(new ApiResponse(200, user, "Email verified successfully."));
});
let resendEmailVerificationCode = asyncHandler(async (req, res) => {
    let user = req.user;
    if (!user) {
        throw new ApiError(401, "Unauthorized. Please log in first.");
    }



    if (user.isVerified) {
        throw new ApiError(400, "Email is already verified.");
    }

    const emailVerificationCode = Math.floor(100000 + Math.random() * 900000);
    await sendEmail(user.email, emailVerificationCode);

    user.emailVerificationCode = emailVerificationCode;

    await generateAccessAndRefereshTokens(user._id);

    await user.save();

    res.status(200).json(new ApiResponse(200, null, "Verification code sent successfully."));
})
let getLoginUserData = asyncHandler(async (req, res) => {
    let user = req.user
    if (!user) {
        throw new ApiError(400, "user not logined!")
    }
    res.status(200).json(200, new ApiResponse(200, user, "user founded"))
})

export {
    createUser,
    verifyEmail,
    loginUser,
    logoutUser,
    updateUser,
    listAllUser,
    resendEmailVerificationCode,
    getLoginUserData
}