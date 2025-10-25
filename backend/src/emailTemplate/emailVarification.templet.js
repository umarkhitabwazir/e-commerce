export const emailVerificationTemp = (emailVerificationCode) => {
    const websiteUrl = process.env.WEBSITE_URL 
  return `
  <!DOCTYPE html>
  <html>
  <head>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
          }
          .container {
              max-width: 600px;
              margin: 20px auto;
              background: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              text-align: center;
          }
          .logo {
              width: 120px;
              height: 120px;
              margin-bottom: 20px;
              border-radius: 50%;
              object-fit: cover;
          }
          .btn {
              display: inline-block;
              background-color: #007bff;
              color: white;
              padding: 10px 20px;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
          }
          .btn:hover {
              background-color: #0056b3;
          }
          .footer {
              margin-top: 30px;
              font-size: 13px;
              color: #999;
              border-top: 1px solid #e0e0e0;
              padding-top: 10px;
          }
          .footer a {
              color: #007bff;
              text-decoration: none;
          }
          .footer a:hover {
              text-decoration: underline;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <img src="${websiteUrl}/logo.jpg" alt="saadiCollection.shop Logo" class="logo" />
          <h2 style="color: #333;">Email Verification</h2>
          <p style="font-size: 16px; color: #555;">
              Your verification code is: <strong>${emailVerificationCode}</strong>
          </p>
          <div class="footer">
              © ${new Date().getFullYear()} <a href=${websiteUrl} target="_blank">saadiCollection.shop</a>. All rights reserved.
          </div>
      </div>
  </body>
  </html>
  `
}
