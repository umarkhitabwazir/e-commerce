import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/apiError.js";
dotenv.config({
    path: ".env"
})
let authMiddleware = async (req, res, next) => {
    // let token = req.headers.authorization;

    let token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
console.log("token",token)
    try {
        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.id) {
            throw new ApiError(401, "Unauthorized. Invalid token.");
        }
        let user = await decoded.id;
        let userExists = await User.findById(user);
        req.user = userExists;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return next(new ApiError(401, "Access token expired. Please refresh your token."));


        }
        if (error.name === "JsonWebTokenError") {
            return next(new ApiError(401, "Invalid token. Please log in again."));

        }

        next(error)


    }
};
export { authMiddleware };