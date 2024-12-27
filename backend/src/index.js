import { app } from "./app.js";
import connectDb from "./db/db.js";
import dotenv from "dotenv";
import { ApiError } from "./utils/apiError.js";

dotenv.config({
    path: ".env",
});

connectDb().then(() => {

    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
}).catch((error) => {

    console.log("DB connection failed: ", error);
    return new ApiError(500, "DB connection failed")
});