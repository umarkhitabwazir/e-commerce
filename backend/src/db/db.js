import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({
    path: ".env",
});

const DB_URL = process.env.DB_URL;


let connectDb = async () => {
    await mongoose.connect(DB_URL)

}

export default connectDb