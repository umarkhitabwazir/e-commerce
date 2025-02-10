import mongoose from "mongoose";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { MoneyTransfer } from "../models/moneyTranser.model.js";
import { ApiResponse } from "../utils/apiResponse.js";

const transferMoney = asyncHandler(async (req, res) => {
    const {  recipientId, amount } = req.body;
constsenderId=req.user.id
if (!senderId) {
    throw new ApiError(400,"user must be logined in!")
}
    
    if (!senderId || !recipientId || !amount || amount <= 0) {
        throw new ApiError(400, "Invalid input: senderId, recipientId, and a positive amount are required");
    }

    if (senderId === recipientId) {
        throw new ApiError(400, "Sender and recipient cannot be the same");
    }

    
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        
        const sender = await User.findById(senderId).session(session);
        const recipient = await User.findById(recipientId).session(session);
        console.log("senderId",session.credentials)

        if (!sender) throw new ApiError(404, "Sender not found");
        if (!recipient) throw new ApiError(404, "Recipient not found");

        
        if (sender.balance < amount) {
            throw new ApiError(400, "Insufficient funds");
        }

        
        sender.balance -= amount;
        recipient.balance += amount;

        
        await sender.save({ session });
        await recipient.save({ session });

        
        await session.commitTransaction();
        session.endSession();
        constmoneyTranser = await MoneyTransfer.create({ senderId, recipientId, amount });
        res.status(200).json(
            new ApiResponse(200, moneyTranser, "Money transferred successfully")
        )
    } catch (error) {
     
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
});

export { transferMoney };
