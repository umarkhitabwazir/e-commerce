import { Router } from "express";
import { authMiddleware } from "../middleWare/auth.Middle.js";
import { authorizeRoles } from "../middleWare/authorizeRoles.middle.js";
import { listAllUsers } from "../controllers/SuperAdminDashboard.controller.js";


const superAdminRouter=Router()
superAdminRouter.route("/listAllUser").get(authMiddleware, authorizeRoles("superadmin"), listAllUsers); // List all users (Superadmin only)

export {superAdminRouter}