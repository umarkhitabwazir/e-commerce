import { transporter } from "../../config/emailTransporter.confilg.js";
import { orderConfirmationTemp } from "../../emailTemplate/orderConfirnedTemp.js";
import { ApiError } from "../apiError.js";





export const sendEmailOrderConfirmed= async (order) => {

    const mailOptions = {
  from: `"SAADIcollection.shop" ${process.env.EMAIL_USER}`,
  to:order.userId.email,
  subject: "Your Order Has Been Confirmed",
  html:orderConfirmationTemp(order)
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