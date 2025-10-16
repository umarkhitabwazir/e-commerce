import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendEmailToSupportTeam } from "../utils/emailSenders/sendEmailToSupportTeam.utils.js"
import {sendcustomerConfirmations} from "../utils/emailSenders/customerContactConfirmation.utils.js"
export const contactUs = asyncHandler(async (req, res) => {
    const { name, email, message } = req.body
    console.log('name,email,message',name,email,message)
    if (!name || !email || !message) {
        throw new ApiError('All field are required!')
    }
    try {
        await sendEmailToSupportTeam(name, email, message)
        await sendcustomerConfirmations(name,email)
        res.status(200).json(new ApiResponse(200, "Your message has been sent successfully. Our support team will contact you soon."))
        
    } catch (error) {
        throw new ApiError(error)
    }

})