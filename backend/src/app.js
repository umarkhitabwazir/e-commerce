import express from "express"
import { userRouter } from "./routes/user.routes.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors"
import { ApiError } from "./utils/apiError.js";
import { sellerRouter } from "./routes/seller.routes.js";
import { productRouter } from "./routes/product.routes.js";
import {  sortingRouters } from "./routes/sorting.routes.js";
import {  orderRouters } from "./routes/order.routes.js";
import {  addressRouters } from "./routes/address.routes.js";
import {  reviewsRouters } from "./routes/reviews.routes.js";
import categoryRouter from "./routes/category.routes.js";
import { cartRouter } from "./routes/cart.rout.js";
import favoritRouter from "./routes/favorate.routes.js";
import sellerRequestRoutes from "./routes/storeRequests.routes.js";
import { contactUsRouter } from "./routes/contactUs.route.js";
import webhookRouter from "./routes/pyment/webhook.routes.js";
import { adminRoutes } from "./routes/adminRoutes/admin.routes.js";
const app = express()
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true, 
   

  })
);



app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/v2",
  adminRoutes,
     userRouter,
   productRouter,
   sortingRouters,
   orderRouters,
   addressRouters,
   reviewsRouters,
  cartRouter,
   categoryRouter,
   favoritRouter,
   sellerRequestRoutes,
   contactUsRouter,
   webhookRouter,
   sellerRouter,


  )



app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    // Handle custom ApiError
    console.log('instanceoferror',err)
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  } else {
    // Handle generic errors
    console.error("Error:", err.stack);
    res.status(500).json({
      success: false,
      error: "An unexpected error occurred.",
    });
  }
});



export { app }









