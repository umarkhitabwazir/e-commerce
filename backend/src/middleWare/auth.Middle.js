import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/User.model.js";
dotenv.config({
    path: ".env"
})
let authMiddleware = async (req, res, next) => {
    // let token = req.headers.authorization;

    let token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

    try {
        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.id) {
            throw new ApiError(401, "Unauthorized. Invalid token.");
        }
        let user = await decoded.id;
        req.user = user;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Access token expired. Please refresh your token." });
        }
        next(error)
    }
};
export { authMiddleware };