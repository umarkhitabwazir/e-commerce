import express from "express"
import { userRouter } from "./routes/user.routes.js";
import bodyParser from "body-parser";
import nodemailer from 'nodemailer';
import cookieParser from "cookie-parser";
import cors from "cors"
import { ApiError } from "./utils/apiError.js";
import { adminRouter } from "./routes/admin.routes.js";
import { superAdminRouter } from "./routes/superAdmin.routes.js";
const app = express()
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true, 
   
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     allowedHeaders: "Content-Type,Authorization",
  })
);


app.use(express.json({ limit: "16kb" }))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/v2",superAdminRouter, adminRouter, userRouter)



app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    // Handle custom ApiError
    console.log('instanceoferror',err)
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  } else {
    // Handle generic errors
    console.error("Error:", err.stack);
    res.status(500).json({
      success: false,
      error: "An unexpected error occurred.",
    });
  }
});



export { app }









