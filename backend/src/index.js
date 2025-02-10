import { app } from "./app.js";
import connectDb from "./db/db.js";
import dotenv from "dotenv";
import { ApiError } from "./utils/apiError.js";

dotenv.config({
    path: ".env",
});
const PORT=process.env.PORT
connectDb().then(() => {

    app.listen(PORT, () => {
        console.log("Server running on port ",PORT);
    });
}).catch((error) => {

    console.log("DB connection failed: ", error);
    return new ApiError(500, "DB connection failed")
});