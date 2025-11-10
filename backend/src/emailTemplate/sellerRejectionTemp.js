export const sellerRejectionTemp = (name) => {
  const WEBSITE_URL = process.env.WEBSITE_URL;
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Store Request Rejected</title>
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
              background-color: #dc2626;
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
          .reason-box {
              background-color: #fef2f2;
              border: 1px solid #fecaca;
              border-radius: 6px;
              padding: 15px;
              margin-top: 20px;
              color: #991b1b;
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
              <h2>Store Request Rejected</h2>
          </div>
          <div class="content">
              <p>Dear ${name || "Applicant"},</p>
              <p>We appreciate your interest in becoming a seller on <strong>saadicollection.shop</strong>. After careful review, we regret to inform you that your store request has not been approved at this time.</p>

              <div class="reason-box">
                  <p><strong>Possible reasons include:</strong></p>
                  <ul style="margin: 8px 0 0 20px;">
                      <li>Incomplete or inaccurate business information</li>
                      <li>Products not aligned with our platform policies</li>
                      <li>Verification documents missing or unclear</li>
                  </ul>
              </div>

              <p style="margin-top: 25px;">
                  You may review your application details and reapply once you have made the necessary updates.
              </p>

              <a href="${WEBSITE_URL}/request-store" class="btn">Submit New Request</a>

              <p style="margin-top: 25px; font-size: 14px; color: #374151;">
                  Thank you for your understanding. We value your effort and hope to collaborate in the future.
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
