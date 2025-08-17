import { app } from "./app.js";
import connectDb from "./db/db.js";
import dotenv from "dotenv";
import { ApiError } from "./utils/apiError.js";

dotenv.config({
    path: ".env",
});
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>eCommerce API</title>
        <style>
          body {
            margin: 0;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: linear-gradient(to right, #eef2f3, #8e9eab);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }
          .container {
            background-color: #fff;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 500px;
            width: 90%;
          }
          h1 {
            color: #2d3748;
            margin-bottom: 10px;
            font-size: 24px;
          }
          p {
            color: #555;
            font-size: 16px;
            margin-top: 0;
          }
          a {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #0070f3;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            transition: background-color 0.3s ease;
          }
          a:hover {
            background-color: #0051b3;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Welcome to the eCommerce API</h1>
          <p>This is the backend API for the e-commerce application.</p>
          <a href="https://github.com/umarkhitabwazir/chat-application-backend" target="_blank">View Documentation</a>
        </div>
      </body>
    </html>
  `);
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