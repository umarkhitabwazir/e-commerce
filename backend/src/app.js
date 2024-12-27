import express from "express"
import {router } from "./routes/user.route.js";
import bodyParser from "body-parser";
import nodemailer from 'nodemailer';  
import cookieParser from "cookie-parser";

let app = express()



app.use(express.json({ limit: "16kb" }))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));
app.use("/api/v2", router)



export { app }









