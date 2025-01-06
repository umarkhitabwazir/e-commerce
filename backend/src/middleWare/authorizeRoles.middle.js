import { ApiError } from "../utils/apiError.js";

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        let user = req.user;
        if (!user) {
            throw new ApiError(401, "Access denied. No user found.");
        }
        let role=roles.includes(req.user.role)
        console.log("role", role);
        if (!roles.includes(req.user.role)) {
            throw new ApiError(403, "Access denied.");
        }
        next();
    };
};
export { authorizeRoles };