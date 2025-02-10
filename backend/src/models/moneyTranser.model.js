import mongoose,{Schema} from "mongoose";
const moneyTransferSchema = new Schema({
    recipientId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:[true,"recipientId is required"]
    },
    senderId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:[true,"senderId is required"]
    },
    amount:{
        type:Number,
        required:[true,"amount is required"]
    }
},{timestamps:true}
)
export const MoneyTransfer = mongoose.model("MoneyTransfer", moneyTransferSchema);