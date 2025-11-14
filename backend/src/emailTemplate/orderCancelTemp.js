export const orderCancelTemp = (order,paymentData, orderedProducts, userName) => {
    const websiteUrl = process.env.WEBSITE_URL;

    const productList = orderedProducts
        .map((item, index) => {
            const matchedProduct = order.products.find(
                (p) => p.productId._id.toString() === item._id.toString()
            );
            const quantity = matchedProduct ? matchedProduct.quantity : 0;

            return `
        <tr>
          <td style="padding:8px;border:1px solid #ddd;text-align:center;">${index + 1}</td>
          <td style="padding:8px;border:1px solid #ddd;display:flex;align-items:center;gap:8px;">
            <img src="${item.image}" alt="${item.title || "Product Image"}" 
              style="width:50px;height:50px;object-fit:cover;border-radius:4px;"/>
          </td>
          <td style="padding:8px;border:1px solid #ddd;text-align:center;">${item.price || "Price"}</td>
          <td style="padding:8px;border:1px solid #ddd;text-align:center;">${item.title || "Title"}</td>
          <td style="padding:8px;border:1px solid #ddd;text-align:center;">${quantity}</td>
        </tr>
      `;
        })
        .join("");

    const refundNote = order.transactionId
        ? `
  <div style="background:#f8f9fa;border-left:4px solid #28a745;padding:15px;margin-top:25px;border-radius:6px;text-align:left;">
        <h4 style="color:#28a745;margin-bottom:8px;">Refund Notice</h4>
        <p style="font-size:15px;color:#444;line-height:1.6;margin:0 0 10px 0;">
          This order was paid online using the transaction ID 
          <strong style="color:#333;">${order.transactionId}</strong>. Our team is verifying this payment. After verification, the refund will be processed.
        </p>

        <h4 style="color:#333;margin:15px 0 8px 0;">Your Refund Details</h4>
        <div style="padding:12px;border:1px solid #ddd;border-radius:6px;background:#fff;">
          <p style="margin:5px 0;font-size:14px;">
            <strong>Payment Platform:</strong> ${paymentData.paymentPlatform}
          </p>
          <p style="margin:5px 0;font-size:14px;">
            <strong>Account Number:</strong> ${paymentData.accountNumber}
          </p>
          <p style="margin:5px 0;font-size:14px;">
            <strong>Account Holder:</strong> ${paymentData.accountUsername}
          </p>
        </div>

        <p style="font-size:14px;color:#555;margin-top:10px;">
          Our finance team will send the refunded amount to the provided account. If any information is incorrect, please update it in your
           <a href="${websiteUrl}/buyer/profile" style="color:#007bff;text-decoration:none;font-weight:600;">Profile</a>.
        </p>
      </div>
    `
        : `
      <div style="background:#f8f9fa;border-left:4px solid #ffc107;padding:15px;margin-top:25px;border-radius:6px;">
        <h4 style="color:#d39e00;margin-bottom:8px;">No Refund Required</h4>
        <p style="font-size:15px;color:#444;line-height:1.6;margin:0;">
          This order was not prepaid. Therefore, no refund is required.
        </p>
      </div>
    `;


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
          table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
          }
          th, td {
              border: 1px solid #ddd;
              padding: 8px;
          }
          th {
              background-color: #f2f2f2;
          }
          .footer {
              margin-top: 20px;
              font-size: 12px;
              color: #777;
          }
          .btn {
              display: inline-block;
              background-color: #007bff;
              color: white;
              padding: 10px 20px;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin-top: 20px;
          }
          .btn:hover {
              background-color: #0056b3;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <img src="${websiteUrl}/logo.jpg" alt="saadicollection.shop Logo" class="logo" />
          <h2 style="color:#d9534f;">Order Cancelled</h2>
          <p style="font-size:16px;color:#555;">
              Hello ${userName || "Customer"}, your order has been successfully cancelled.
          </p>

          <h3 style="color:#333;">Cancelled Order Summary</h3>
          <h6 style="color:#333;">Tracking ID: ${order._id.toString()}</h6>

          <table>
              <thead>
                  <tr>
                      <th>#</th>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Title</th>
                      <th>Quantity</th>
                  </tr>
              </thead>
              <tbody>
                  ${productList}
              </tbody>
          </table>

          <p style="font-size:15px;color:#555;margin-top:20px;">
              <strong>Payment Method:</strong> ${order.paymentMethod || "Not provided"}<br>
              <strong>Total:</strong> <span style="color:#007bff;">PKR ${order.totalPrice?.toFixed(2) || "0.00"}</span>
          </p>

          ${refundNote}

          <a href="${websiteUrl}/buyer/orders?tab=canceled" class="btn">View Orders</a>

          <p class="footer">
              © ${new Date().getFullYear()} SAADICollection.shop. All rights reserved.
          </p>
      </div>
  </body>
  </html>
  `;
};
