import { User } from "../models/User.model.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { ApiError } from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { validationResult } from "express-validator";
import { sendEmailVarification } from "../utils/emailSenders/emailVarificationSender.utils.js";
import dotenv from "dotenv"

dotenv.config({
    path: ".env"
})

const generateAccessAndRefereshTokens = async (userId) => {
    try {

        const user = await User.findById(userId)
        if (!user) {
            throw new ApiError(404, "User not found")
        }
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken

        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token", error)
    }
}

const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? "None" : 'Lax',
    // domain: process.env.WEBSITE_URL,

}






// this is for email varification and workable ,but out of credits not able to check

// const  verifyEmailWithZeroBounce = async (email) => {
//     const  apiKey = process.env.ZEROBOUNCE_API_KEY;
//     console.log("apiKey",apiKey)
//     const  url = `https://api.zerobounce.net/v2/validate?api_key=${apiKey}&email=${email}`;
//     try {
//         const  response = await axios.get(url);
//         console.log("response.data",response.data)
//         return response.data.status === "valid"; // Returns true if valid, false otherwise
//     } catch (error) {
//         console.error("Error validating email:", error);
//         throw new ApiError(500, "Failed to validate email.");
//     }
// };

const createUser = asyncHandler(async (req, res) => {
    const { username, email, role, phone, password } = req.body


    if ([username, phone, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(400, errors.array()[0].msg);
    }



    if (role === "admin") {
        throw new ApiError(400, "you only create user and admin role! ")
    }

    const exitUser = await User.findOne({
        $or: [{ email: email }]
    })

    if (exitUser) {
        throw new ApiError(400, "email already exists")
    }
    const emailVerificationCode = Math.floor(100000 + Math.random() * 900000);
    await sendEmailVarification(email, emailVerificationCode)


    const user = new User({
        username,
        phone,
        email,
        role,
        password,
        emailVerificationCode,


    })

    await user.save()

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

    res.
        cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options).
        status(201).json(new ApiResponse(201, user, "User created successfully, Please verify your email.")
        )




})

const updateUser = asyncHandler(async (req, res) => {
    const user = req.user
    const { username, phone } = req.body
    if (!user.id) {
        throw new ApiError(401, "Unauthorized. Please log in first.")
    }
    if (!username || !phone) {
        throw new ApiError(400, "Username and phone are required.")

    }

    const updatedUser = await User.findById(user._id);
    if (!updatedUser) {
        throw new ApiError(404, "User not found.");
    }
    user.username = username
    user.phone = phone

    await user.save()

    res.status(201).json(new ApiResponse(201, user, "User updated successfully"))
})

const isProduction = process.env.NODE_ENV === 'production'

const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body
    try {
        if (!email || !password) {
            throw new ApiError(400, "Email and password are required")
        }
        const user = await User.findOne({ email: email })


        if (!user) {
            throw new ApiError(404, "User not found,Please Signup")
        }
        const isMatch = await user.comparePassword(password)
        if (!isMatch) {
            throw new ApiError(400, "Invalid password")
        }
        if (user.role === "seller") {
            switch (user.status) {
                case "pending":
                    throw new ApiError(403, "Your seller account is under review. Please wait for approval.");
                case "suspended":
                    throw new ApiError(403, "Your seller account has been suspended. Contact support for details.");
                case "blocked":
                    throw new ApiError(403, "Your seller account has been blocked. Contact support to resolve this issue.");
                case "approved":
                    break;
                default:
                    throw new ApiError(403, "Invalid seller account status.");
            }
        }


        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

        const isVerified = user.isVerified
        if (!isVerified) {
            const emailVerificationCode = Math.floor(100000 + Math.random() * 900000);
            await sendEmailVarification(email, emailVerificationCode)
            user.emailVerificationCode = emailVerificationCode
            await user.save()

            res.
                cookie("accessToken", accessToken, options)
                .cookie("refreshToken", refreshToken, options).
                status(200).json(new ApiResponse(200, "notVerified", "Email is not verified. Verification code has been sent to your email.", true)
                )
            return;
        }

        if (isVerified) {

            res.
                cookie("accessToken", accessToken, options)
                .cookie("refreshToken", refreshToken, options).
                status(200).json(new ApiResponse(200, user, "user loged in successfully!", true)
                )
        }
    } catch (error) {
        console.log('loginer', error)
        next(error)
    }


})

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) {
            throw new ApiError(400, "Email is required.");
        }
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new ApiError(404, "User not found with this email.");
        }
        const emailVerificationCode = Math.floor(100000 + Math.random() * 900000);
        user.passwordResetCode = emailVerificationCode;
        await user.save();

        await sendEmailVarification(user.email, emailVerificationCode);
        res.status(200).json(new ApiResponse(200, null, "email varification code send successfully."));

    } catch (error) {
        console.error("forgotPassError", error)
    }
})
const resetPassword = asyncHandler(async (req, res) => {
    const { email, passwordResetCode, newPassword } = req.body;
    if (!email || !passwordResetCode || !newPassword) {
        throw new ApiError(400, "All fields are required.");
    }
    const user = await User.findOne({ email: email });
    if (!user) {
        throw new ApiError(404, "User not found.");
    }
    if (user.passwordResetCode !== Number(passwordResetCode)) {
        throw new ApiError(400, "Invalid password reset code.");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

    user.password = newPassword;
    user.passwordResetCode = null;
    await user.save();
    res.
        cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options).
        status(200).json(new ApiResponse(200, null, "Password reset successfully."));
})

const logoutUser = asyncHandler(async (req, res) => {
    const user = req.user

    if (!user) {
        throw new ApiError(404, "User not not logged in")
    }
    user.refreshToken = ""
    await user.save({ validateBeforeSave: false })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'None' : 'Lax',
        // domain: process.env.WEBSITE_URL
    });
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'None' : 'Lax',
        // domain: process.env.WEBSITE_URL
    });
    res.status(200).json(new ApiResponse(200, null, "User logged out successfully"))
})

const verifyEmail = asyncHandler(async (req, res) => {
    const { emailVerificationCode } = req.body;

    if (!emailVerificationCode) {
        throw new ApiError(400, "Verification code is required.");
    }

    const user = req.user;
    if (!user) {
        throw new ApiError(401, "Unauthorized. Please log in first.");
    }



    if (user.isVerified) {
        throw new ApiError(400, "Email is already verified,  return to given below home page.");
    }

    if (user.emailVerificationCode !== parseInt(emailVerificationCode)) {
        throw new ApiError(400, "Invalid verification code.");
    }

    user.isVerified = true;
    user.emailVerificationCode = null;
    user.status="approved"

    await generateAccessAndRefereshTokens(user._id);
    await user.save();


    res.status(200).json(new ApiResponse(200, user, "Email verified successfully."));
});
const resendEmailVerificationCode = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(401, "Unauthorized. Please log in first.");
    }



    if (user.isVerified) {
        throw new ApiError(400, "Email is already verified you can skip this step.");
    }

    const emailVerificationCode = Math.floor(100000 + Math.random() * 900000);
    await sendEmailVarification(user.email, emailVerificationCode);

    user.emailVerificationCode = emailVerificationCode;

    await generateAccessAndRefereshTokens(user._id);

    await user.save();

    res.status(200).json(new ApiResponse(200, null, "Verification code sent successfully."));
})
const getLoginUserData = asyncHandler(async (req, res) => {
    const user = req.user
    if (!user) {
        throw new ApiError(400, null, "user not logined!", false)
    }
    const verified = user.isVerified
    if (!verified) {
        sendEmailVarification(user.email, user.emailVerificationCode)
        throw new ApiError(403, null, "Please verify your email to access this resource.", false)
    }
    res.status(200).json({ status: 200, data: user, message: "user founded" })
})

export {
    createUser,
    verifyEmail,
    loginUser,
    forgotPassword,
    resetPassword,
    logoutUser,
    updateUser,
    resendEmailVerificationCode,
    getLoginUserData
}