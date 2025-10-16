export const customerContactConfirmationTemp = (name) => {
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
          .header {
              background-color: #007bff;
              color: #fff;
              padding: 15px;
              border-radius: 8px 8px 0 0;
          }
          .content {
              margin-top: 20px;
              color: #333;
              font-size: 15px;
              line-height: 1.6;
          }
          .footer {
              margin-top: 25px;
              font-size: 12px;
              color: #777;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <img src="https://saadicollection.shop/logo.jpg" alt="saadiCollection.shop Logo" class="logo" />
          <div class="header">
              <h2>Message Received</h2>
          </div>
          <div class="content">
              <p>Hi ${name || "Customer"},</p>
              <p>We’ve received your message and our support team will contact you soon.</p>
              <p>Thank you for reaching out to <strong>saadicollection.shop</strong>.</p>
          </div>
          <div class="footer">
              <p>© ${new Date().getFullYear()} SAADiCcollection.shop. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
  `;
};
