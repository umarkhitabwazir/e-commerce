import { ApiError } from "../apiError.js";
import { sellerApprovalTemp } from "../../emailTemplate/sellerApprovalTemp.js";
import { transporter } from "../../config/emailTransporter.confilg.js";





export const sellerApprovalEmailSender= async (name,email,randomPassword) => {

    const mailOptions = {
  from: `"SAADiC Admin" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: "Your Seller Account Has Been Approved",
  html:sellerApprovalTemp(name,email,randomPassword)
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