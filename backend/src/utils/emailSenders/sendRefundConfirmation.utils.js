import { transporter } from "../../config/emailTransporter.confilg.js";
import { refundConfirmationTemp } from "../../emailTemplate/refundConfirmationTemp .js";
import { ApiError } from "../apiError.js";





export const sendEmailRefundConfirmation = async (order,refundedProducts,email, userName) => {

const mailOptions = {
  from: `"SaadiCollection.shop" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: "Your refund has been processed successfully",
  html: refundConfirmationTemp(order, refundedProducts, userName),
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