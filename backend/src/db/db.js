import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({
    path: ".env",
});

const DB_URL = process.env.DB_URL;

const connectDb = async () => {
    try {
        
        await mongoose.connect(DB_URL)
          .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection failed:', err));
    } catch (error) {
        console.log('moongooDb error',error)
    }

}

export default connectDb