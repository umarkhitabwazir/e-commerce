import { User } from "../models/User.model.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { ApiError } from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { validationResult } from "express-validator";
import nodemailer from "nodemailer";
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

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    logger: true,
    debug: true,
});

const sendEmail = async (email, emailVerificationCode) => {
    const verificationLink = `${process.env.CORS_ORIGIN}verify-email?&code=${emailVerificationCode}`;

    const mailOptions = {
        from: `"UK Bazaar" ${process.env.EMAIL_USER}`, // Use domain-based email in production
        to: email,
        subject: "Email Verification",
        html: `
           <!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .btn {
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }
        .btn:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2 style="color: #333; text-align: center;">Email Verification</h2>
        <p style="font-size: 16px; color: #555;">
            Your verification code is: <strong>${emailVerificationCode}</strong>
        </p>
        
    </div>
</body>
</html>

        `,
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
    const { username, email, fullName, role, phone, password } = req.body


    if ([username, email, fullName, phone, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(400, errors.array()[0].msg);
    }



    if (role === "superadmin") {
        throw new ApiError(400, "you only create user and admin role! ")
    }

    const exitUser = await User.findOne({
        $or: [{ username: username }, { email: email }]
    })

    if (exitUser) {
        throw new ApiError(400, "User username or email already exists")
    }
    const emailVerificationCode = Math.floor(100000 + Math.random() * 900000);
    await sendEmail(email, emailVerificationCode)


    const user = new User({
        username,
        email,
        fullName,
        role,
        phone,
        password,
        emailVerificationCode,


    })

    await user.save()
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite:process.env.NODE_ENV === 'production'? "None":'Lax',
        // domain: process.env.FRONTEND_DOMAIN,

    }
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

    res.
        cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options).
        status(201).json(new ApiResponse(201, user, "User created successfully, Please verify your email.")
        )




})

const updateUser = asyncHandler(async (req, res) => {
    const user = req.user
    const { fullName, username, phone } = req.body
    if (!user.id) {
        throw new ApiError(401, "Unauthorized. Please log in first.")
    }
    if (fullName, username, phone) {

        user.username = username
        user.fullName = fullName

        user.phone = phone
        await user.save()
    }

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

        const options = {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'None' : 'Lax',
            // domain: process.env.FRONTEND_DOMAIN

        }
        if (!user) {
            throw new ApiError(404, "User not found")
        }
        const isMatch = await user.comparePassword(password)
        if (!isMatch) {
            throw new ApiError(400, "Invalid password")
        }
        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

        const isVerified = user.isVerified
        if (!isVerified) {
            const emailVerificationCode = Math.floor(100000 + Math.random() * 900000);
            await sendEmail(email, emailVerificationCode)
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
    
        await sendEmail(user.email, emailVerificationCode);
        res.status(200).json(new ApiResponse(200, null, "Password reset code sent successfully."));
        
    } catch (error) {
        console.error("forgotPassError",error)
    }
})
const resetPassword = asyncHandler(async (req, res) => {
    const { email, passwordResetCode, newPassword } = req.body;
    console.log('resetPassword', req.body)
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
    user.password = newPassword;
    user.passwordResetCode = null;
    await user.save();
    res.status(200).json(new ApiResponse(200, null, "Password reset successfully."));
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
        // domain: process.env.FRONTEND_DOMAIN
    });
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'None' : 'Lax',
        // domain: process.env.FRONTEND_DOMAIN
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
    await sendEmail(user.email, emailVerificationCode);

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