import nodemailer from "nodemailer";
import { orderConfirmationTemp } from "../../emailTemplate/orderPlaced.template.js";
import { ApiError } from "../apiError.js";


const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    logger: true,
    debug: true,
});


export const sendEmailOrderPlaced = async (order,orderedProduct,email, userName) => {

    const mailOptions = {
  from: `"noreply" ${process.env.EMAIL_USER}`,
  to: email,
  subject: "Order placed – cancel within 15 minutes",
  html:orderConfirmationTemp(order,orderedProduct,userName)
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