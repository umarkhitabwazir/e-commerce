// server/webhook.js
import express from "express";
import dotenv from "dotenv";
import { webhookController } from "../../controllers/pyment/Webhook.controller.js";
dotenv.config();

const webhookRouter = express.Router();

// Raw body is required. Ensure you used express.raw for this route.
webhookRouter.route("/api/safepay/webhook").post(webhookController )

export default webhookRouter;
