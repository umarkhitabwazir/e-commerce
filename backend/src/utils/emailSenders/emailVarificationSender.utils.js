import { transporter } from "../../config/emailTransporter.confilg.js";
import { emailVerificationTemp } from "../../emailTemplate/emailVarification.templet.js";
import { ApiError } from "../apiError.js";




export const sendEmailVarification = async (email, emailVerificationCode) => {
    // const verificationLink = `${process.env.CORS_ORIGIN}verify-email?&code=${emailVerificationCode}`;

    const mailOptions = {
  from: `"noreply" ${process.env.EMAIL_USER}`,
  to: email,
  subject: "Email Verification",
  html:emailVerificationTemp(emailVerificationCode)
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