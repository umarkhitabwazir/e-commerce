
let categorySchema = new Schema(
    {
    name:{
        type:String,
        required:[true,"name is required"],
        trim:true,
        index:true,
    },
    description:{
        type:String,
        required:[true,"description is required"],
        trim:true,
    },
    image:{
        type:String,
        required:[true,"image is required"],
        trim:true,
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:[true,"user is required"],
    }


}
);