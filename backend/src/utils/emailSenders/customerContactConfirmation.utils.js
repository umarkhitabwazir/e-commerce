import nodemailer from "nodemailer";
import { customerContactConfirmationTemp } from "../../emailTemplate/customerContactConfirmationTemp.js";


const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    logger: true,
    debug: true,
});


export const sendcustomerConfirmations = async (name,email) => {

    const mailOptions = {
  from: `"saadiCollection Support" ${process.env.EMAIL_USER}`,
  to: email,
  subject: "We’ve received your message",
  html:customerContactConfirmationTemp(name)
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