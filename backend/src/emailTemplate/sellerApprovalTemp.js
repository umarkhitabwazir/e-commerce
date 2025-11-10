export const sellerApprovalTemp = (name, email, randomPassword) => {
  const WEBSITE_URL = process.env.WEBSITE_URL;
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Seller Account Approved</title>
      <style>
          body {
              font-family: 'Inter', Arial, sans-serif;
              background-color: #f3f4f6;
              margin: 0;
              padding: 0;
              color: #1f2937;
          }
          .container {
              max-width: 600px;
              margin: 30px auto;
              background: #ffffff;
              border-radius: 10px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
              overflow: hidden;
          }
          .header {
              background-color: #16a34a;
              color: #ffffff;
              padding: 20px;
              text-align: center;
          }
          .header h2 {
              margin: 0;
              font-size: 22px;
              letter-spacing: 0.3px;
          }
          .logo {
              width: 110px;
              margin: 25px auto 10px;
              display: block;
          }
          .content {
              padding: 25px 30px;
              line-height: 1.6;
              font-size: 15px;
              text-align: left;
          }
          .content strong {
              color: #111827;
          }
          .credentials {
              background-color: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 6px;
              padding: 15px;
              margin-top: 20px;
          }
          .credentials p {
              margin: 8px 0;
              font-size: 14px;
          }
          .btn {
              display: inline-block;
              background-color: #2563eb;
              color: #ffffff;
              padding: 12px 22px;
              border-radius: 6px;
              text-decoration: none;
              font-weight: 600;
              font-size: 15px;
              margin-top: 25px;
              transition: background-color 0.2s ease;
          }
          .btn:hover {
              background-color: #1d4ed8;
          }
          .footer {
              text-align: center;
              font-size: 13px;
              color: #6b7280;
              padding: 20px;
              border-top: 1px solid #e5e7eb;
              background-color: #f9fafb;
          }
          @media (max-width: 600px) {
              .container {
                  margin: 15px;
              }
              .content {
                  padding: 20px;
              }
          }
      </style>
  </head>
  <body>
      <div class="container">
          <img src="${WEBSITE_URL}/logo.jpg" alt="saadicollection.shop Logo" class="logo" />
          <div class="header">
              <h2>Seller Account Approved</h2>
          </div>
          <div class="content">
              <p>Dear ${name || "Seller"},</p>
              <p>We’re pleased to inform you that your request to join <strong>saadicollection.shop</strong> as a seller has been approved.</p>
              <p>Please use the credentials below to access your account:</p>

              <div class="credentials">
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Temporary Password:</strong> ${randomPassword}</p>
              </div>

              <a href="${WEBSITE_URL}/login" class="btn">Login to Your Seller Account</a>

              <p style="margin-top: 25px; font-size: 14px; color: #374151;">
                  For your security, change your password after your first login.
              </p>
          </div>
          <div class="footer">
              <p>© ${new Date().getFullYear()} SAADiCcollection.shop. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
  `;
};
