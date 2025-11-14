import { transporter } from "../../config/emailTransporter.confilg.js";
import { orderCancelTemp } from "../../emailTemplate/orderCancelTemp.js";
import { ApiError } from "../apiError.js";





export const sendEmailOrderCancel = async (order,paymentData,orderCancelProducts,email, userName,transactionId) => {

const mailOptions = {
  from: `"SaadiCollection.shop" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: transactionId
    ? "Order Cancelled – Refund Initiated"
    : "Order Cancelled Successfully",
  html: orderCancelTemp(order,paymentData, orderCancelProducts, userName),
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