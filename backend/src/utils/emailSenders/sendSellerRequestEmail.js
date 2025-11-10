import { transporter } from "../../config/emailTransporter.confilg.js";
import sellerRequestTemplate from "../../emailTemplate/sellerRequest.template.js";




export const sendSellerRequestEmail = async (StoreName,OwnerName,ContactEmail,SubmissionDate,ReferenceID,phone) => {
  
    const mailOptions = {
        from: `"SaadiCollection" ${process.env.EMAIL_USER}`, 
        to: ContactEmail,
        subject: "seller store request",
        html: sellerRequestTemplate(StoreName,OwnerName,ContactEmail,SubmissionDate,ReferenceID,phone)
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