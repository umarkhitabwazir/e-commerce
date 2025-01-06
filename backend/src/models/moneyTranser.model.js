import mongoose,{Schema} from "mongoose";
let moneyTransferSchema = new Schema({
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
export let MoneyTransfer = mongoose.model("MoneyTransfer", moneyTransferSchema);