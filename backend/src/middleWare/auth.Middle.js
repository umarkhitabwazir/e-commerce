import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/apiError.js";
dotenv.config({
    path: ".env"
})
const authMiddleware = async (req, res, next) => {

    const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    const refreshToken = req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer ", "")

    if (!accessToken) {
        next(new ApiError(401, "Unauthorized"))
    }
    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET);
        
        if (!decoded || !decoded.id) {
            throw new ApiError(401, "Unauthorized. Invalid token.");
        }
        const user = decoded.id;
        const userExists = await User.findById(user);

        if (!userExists) {
            throw new ApiError(401, "user not founded!")
        }
       

        req.user = userExists;
        next();
    } catch (error) {

        if (error.name === "TokenExpiredError") {

            return next(new ApiError(401, "Access token expired. Please refresh your token."));


        }
        if (error.name === "JsonWebTokenError") {
console.log('authMiddleware error',error)
            return next(new ApiError(401, "Invalid token. Please log in again."));

        }

        next(error)


    }
};
export { authMiddleware };