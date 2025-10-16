import nodemailer from "nodemailer";
import { emailVerificationTemp } from "../../emailTemplate/emailVarification.templet.js";


const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    logger: true,
    debug: true,
});


export const sendEmailVarification = async (email, emailVerificationCode) => {
    const verificationLink = `${process.env.CORS_ORIGIN}verify-email?&code=${emailVerificationCode}`;

    const mailOptions = {
  from: `"saadiCollection.shop" ${process.env.EMAIL_USER}`,
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