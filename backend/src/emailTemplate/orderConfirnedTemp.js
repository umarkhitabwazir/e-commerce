export const orderConfirmationTemp = (order) => {
  const websiteUrl = process.env.WEBSITE_URL;

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
              margin: 30px auto;
              background: #ffffff;
              padding: 25px;
              border-radius: 10px;
              text-align: center;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          }
          .logo {
              width: 120px;
              margin-bottom: 20px;
          }
          h2 {
              color: #333333;
              margin-bottom: 15px;
          }
          p {
              font-size: 16px;
              color: #555555;
              line-height: 1.6;
              margin: 10px 0;
          }
          .highlight {
              color: #007bff;
              font-weight: bold;
          }
          .btn {
              display: inline-block;
              background-color: #007bff;
              color: #ffffff;
              padding: 12px 25px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
              margin-top: 25px;
          }
          .btn:hover {
              background-color: #0056b3;
          }
          .footer {
              margin-top: 30px;
              font-size: 12px;
              color: #777777;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <img src="${websiteUrl}/logo.jpg" alt="saadiCollection.shop Logo" class="logo" />
          <h2>Order Confirmed Successfully</h2>
          <p>Hello ${order.userId.username || "Customer"}, your order has been confirmed by the seller.</p>
          <p><strong>Tracking ID:</strong> <span class="highlight">${order._id.toString()}</span></p>
          <p>
              <strong>Payment Method:</strong> ${order.paymentMethod || "Not provided"}<br>
              <strong>Tax:</strong> PKR ${order.taxPrice?.toFixed(2) || "0.00"}<br>
              <strong>Shipping:</strong> PKR ${order.shippingPrice?.toFixed(2) || "0.00"}<br>
              <strong>Total:</strong> <span class="highlight">PKR ${order.totalPrice?.toFixed(2) || "0.00"}</span>
          </p>

          <a href="${websiteUrl}/buyer/orders" class="btn">View Order</a>

          <p class="footer">© ${new Date().getFullYear()} SAADICollection.shop. All rights reserved.</p>
      </div>
  </body>
  </html>
  `;
};
