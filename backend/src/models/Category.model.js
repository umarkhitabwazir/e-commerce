import mongoose,{Schema} from "mongoose";

const categorySchema = new Schema(
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
export const Category=mongoose.model("Category",categorySchema)