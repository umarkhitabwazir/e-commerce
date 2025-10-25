export const orderConfirmationTemp = (order, orderedProducts, userName) => {
  const websiteUrl = process.env.WEBSITE_URL
    const productList = orderedProducts
        .map((item, index) => {
            const matchedProduct = order.products.find(
                (p) => p.productId.toString() === item._id.toString()
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
          <td style="padding:8px;border:1px solid #ddd;text-align:center;">${item.title || "title"}</td>
          <td style="padding:8px;border:1px solid #ddd;text-align:center;">${quantity}</td>
        </tr>
      `;
        })
        .join("");

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
          .footer {
              margin-top: 20px;
              font-size: 12px;
              color: #777;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <img src="${websiteUrl}/logo.jpg" alt="saadiCollection.shop Logo" class="logo" />
          <h2 style="color: #333;">Order Placed Successfully</h2>
          <p style="font-size: 16px; color: #555;">
              Hello ${userName || "Customer"}, your order has been placed successfully.
          </p>
          <p style="font-size: 15px; color: #555;">
              You can cancel your order within 15 minutes if needed.
          </p>

          <h3 style="color: #333;">Order Summary</h3>
          <h6 style="color: #333;">Traking Id:${' '}${order._id.toString()}</h6>
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

          <p style="font-size: 15px; color: #555; margin-top: 20px;">
              <strong>Payment Method:</strong> ${order.paymentMethod || "Not provided"}<br>
              <strong>Tax:</strong> PKR${' '}${order.taxPrice?.toFixed(2) || "0.00"}<br>
              <strong>Shipping:</strong> PKR${' '}${order.shippingPrice?.toFixed(2) || "0.00"}<br>
              <strong>Total:</strong> <span style="color:#007bff;">$${order.totalPrice?.toFixed(2) || "0.00"}</span>
          </p>

          <a href="${websiteUrl}/buyer/orders" class="btn">View Order</a>

          <p class="footer">
              © ${new Date().getFullYear()} SAADICollection.shop. All rights reserved.
          </p>
      </div>
  </body>
  </html>
  `;
};
