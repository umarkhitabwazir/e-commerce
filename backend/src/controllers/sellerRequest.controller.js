import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import SellerRequest from "../models/sellerRequest.model.js";
import nodemailer from "nodemailer";
import sellerRequestTemplate from "../emailTemplate/sellerRequest.template.js";

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    logger: true,
    debug: true,
});

const sendEmail = async (StoreName,OwnerName,ContactEmail,SubmissionDate,ReferenceID) => {
  
    const mailOptions = {
        from: `"UK Bazaar" ${process.env.EMAIL_USER}`, // Use domain-based email in production
        to: ContactEmail,
        subject: "seller store request",
        html: sellerRequestTemplate(StoreName,OwnerName,ContactEmail,SubmissionDate,ReferenceID)
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

const sellerRequest=asyncHandler(async(req,res)=>{
const{storeName,ownerName,email,description}=req.body



    if (storeName |ownerName |email |description) {
        throw  new ApiError(401,'all fields are requried!')
    }
    const createRequest=await SellerRequest.create({
        storeName,
    ownerName,
    email,
    description
    })
    const SubmissionDate=new Date()
    sendEmail(storeName,ownerName,email,SubmissionDate,createRequest._id)
    res.status(201).json(new ApiResponse(201,createRequest))

}) 

export {
    sellerRequest
}