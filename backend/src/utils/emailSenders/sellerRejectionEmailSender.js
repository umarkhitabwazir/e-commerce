import { ApiError } from "../apiError.js";
import { transporter } from "../../config/emailTransporter.confilg.js";
import { sellerRejectionTemp } from "../../emailTemplate/sellerRejectionTemp.js";





export const sellerRejectionEmailSender= async (email,name) => {

    const mailOptions = {
  from: `"SAADiC Admin" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: "Your Store Request Has Been Rejected",
  html:sellerRejectionTemp(name,)
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