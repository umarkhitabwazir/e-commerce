import { User } from "../models/User.model.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { ApiError } from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { body, validationResult } from "express-validator";
import nodemailer from "nodemailer";
import axios from "axios"
import dotenv from "dotenv"
dotenv.config({
    path:".env"
})

let generateAccessAndRefereshTokens = async (userid) => {
    try {
        let user = await User.findById(userid)
console.log("user",user)
        if (!user) {
            throw new ApiError(404, "User not found")
        }
        let accessToken =await user.generateAccessToken()
        let refreshToken =await user.generateRefreshToken()
console.log("accessToken,refreshToken",accessToken,refreshToken)
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


    if ([username, email, fullName, role, address, phone, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(400, errors.array()[0].msg);
    }


    if (role !== "user" && role !== "admin") {
        throw new ApiError(400, "Role must be user or admin")

    }
    // await verifyEmailWithZeroBounce(email);


    let exitUser = await User.findOne({
        $or: [{ username: username }, { email: email }]
    })

    if (exitUser) {
        throw new ApiError(400, "User username or email already exists")
    }
    const emailVerificationCode = Math.floor(100000 + Math.random() * 900000);
    await sendEmail(email,emailVerificationCode)

   
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
        status(201).json(new ApiResponse(201, null, "User created successfully, Please verify your email.")
        )




})

let loginUser = asyncHandler(async (req, res) => {
    let { email, password } = req.body
    if (!email || !password) {
        throw new ApiError(400, "Email and password are required")
    }
    let user = await User.findOne({ email: email })
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
        await sendEmail(email,emailVerificationCode)
        user.emailVerificationCode = emailVerificationCode
        await user.save()
        throw new ApiError(401, "Email is not verified, Verification code sent to your email")
    }
    
    let options = {
        httponly: true,
        secure: true,
    }
    let { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)
    res.
        cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options).
        status(200).json(new ApiResponse(200, null, "User logged in successfully")
        )

})

let logoutUser = asyncHandler(async (req, res) => {
    let userId = req.user
    let user = await User.findById(userId)
    if (!user) {
        throw new ApiError(404, "User not found")
    }
    user.refreshToken = ""
    await user.save({ validateBeforeSave: false })
    res.clearCookie("accessToken")
    res.clearCookie("refreshToken")
    res.status(200).json(new ApiResponse(200, null, "User logged out successfully"))
})

let verifyEmail = asyncHandler(async (req, res) => {
    const { emailVerificationCode } = req.body;

    if (!emailVerificationCode) {
        throw new ApiError(400, "Verification code is required.");
    }
 
    let userId = req.user;
    if (!userId) {
        throw new ApiError(401, "Unauthorized. Please log in first.");
    }

    let user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    if (user.isVerified) {
        throw new ApiError(400, "Email is already verified.");
    }

    if (user.emailVerificationCode !== parseInt(emailVerificationCode)) {
        throw new ApiError(400, "Invalid verification code.");
    }

    user.isVerified = true;
    user.emailVerificationCode = null; // Clear the code after verification
    await user.save();

     await generateAccessAndRefereshTokens(user._id);

    res.status(200).json(new ApiResponse(200, user.isVerified, "Email verified successfully."));
});

export { createUser, verifyEmail, loginUser,logoutUser }