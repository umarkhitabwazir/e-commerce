export const emailVerificationTemp=(emailVerificationCode)=>{
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
              margin-bottom: 20px;
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
      </style>
  </head>
  <body>
      <div class="container">
          <img src="https://saadicollection.shop/logo.jpg" alt="saadiCollection.shop Logo" class="logo" />
          <h2 style="color: #333;">Email Verification</h2>
          <p style="font-size: 16px; color: #555;">
              Your verification code is: <strong>${emailVerificationCode}</strong>
          </p>
      </div>
  </body>
  </html>
    
    `
}