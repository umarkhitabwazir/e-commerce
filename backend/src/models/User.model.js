import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({
    path: ".env"        
})

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: [true,"username is required"],
            lowercase: true,
            trim: true, 
            index: true
        },
        email: {
            type: String,
            required: [true,"email is required"],
            unique: true,
            lowecase: true,
            trim: true, 
        },
            role:{
            type: String,
            trim: true, 
            enum:  ["buyer", "seller", "super-admin"], 
            default: "buyer"             
        },
        password: {
            type: String,
            required: [true,"password is required"],
            trim: true, 
        },
        passwordResetCode:{
            type: Number,
            trim: true,
        },
      
      
        refreshToken: {
            type: String,
            default: ""
        },
        emailVerificationCode:{
            type: Number,
            trim: true,
        },
        isVerified:{
            type: Boolean,
            default: false
        }

    },{timestamps: true}
)

userSchema.pre("save",async function(next){
    const user = this
    if(!user.isModified("password")) return next()
    user.password = bcrypt.hashSync(user.password,10)
    next()
})
userSchema.methods.comparePassword =async function(plainPassword){
    return await bcrypt.compareSync(plainPassword,this.password)
}
userSchema.methods.generateAccessToken =async function(){
    return jwt.sign({id:this._id},
        process.env.JWT_ACCESS_TOKEN_SECRET,
        {expiresIn:process.env.JWT_ACCESS_TOKEN_EXPIRES_IN})

}
userSchema.methods.generateRefreshToken =async function(){
    return jwt.sign({id:this._id},
        process.env.JWT_REFRESH_TOKEN_SECRET,
        {expiresIn:process.env.JWT_REFRESH_TOKEN_EXPIRES_IN})
}
export const User = mongoose.model( "User", userSchema)