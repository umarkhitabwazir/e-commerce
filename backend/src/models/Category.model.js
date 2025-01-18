import mongoose,{Schema} from "mongoose";

let categorySchema = new Schema(
    {
    categoryName:{
        type:String,
        required:[true,"name is required"],
        trim:true,
        unique: true,
        index:true,
    },
 
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:[true,"user is required"],
    }


}
);
export let Category=mongoose.model("Category",categorySchema)