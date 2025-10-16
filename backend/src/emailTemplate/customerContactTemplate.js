export const customerContactTemp = (name, email, message) => {
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
          }
          .header {
              background-color: #007bff;
              color: #fff;
              text-align: center;
              padding: 15px;
              border-radius: 8px 8px 0 0;
          }
          .content {
              margin-top: 15px;
              color: #333;
              font-size: 15px;
          }
          .content p {
              margin: 8px 0;
          }
          .label {
              font-weight: bold;
              color: #555;
          }
          .footer {
              text-align: center;
              font-size: 12px;
              color: #777;
              margin-top: 20px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h2>New Contact Message</h2>
          </div>
          <div class="content">
              <p class="label">Name:</p>
              <p>${name}</p>

              <p class="label">Email:</p>
              <p>${email}</p>

              <p class="label">Message:</p>
              <p style="white-space: pre-line;">${message}</p>
          </div>

          <div class="footer">
              <p>This message was sent from the contact form on <strong>saadicollection.shop</strong>.</p>
          </div>
      </div>
  </body>
  </html>
  `;
};
