export const refundConfirmationTemp = (order, refundedProducts, userName) => {
  const websiteUrl = process.env.WEBSITE_URL
  const productList = refundedProducts
    .map((item, index) => {
      const matchedProduct = order.products.find(
        (p) => p.productId._id.toString() === item._id.toString()
      )
      const quantity = matchedProduct ? matchedProduct.quantity : 0

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
      `
    })
    .join("")

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
              background-color: #28a745;
              color: white;
              padding: 10px 20px;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin-top: 20px;
          }
          .btn:hover {
              background-color: #218838;
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
          <h2 style="color: #333;">Refund Processed Successfully</h2>
          <p style="font-size: 16px; color: #555;">
              Hello ${userName || "Customer"}, your refund has been successfully processed.
          </p>
          <p style="font-size: 15px; color: #555;">
              The following items were refunded to your original payment method.
          </p>

          <h3 style="color: #333;">Refund Summary</h3>
          <h6 style="color: #333;">Refund ID: ${order._id.toString()}</h6>
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
              <strong>Refund Amount:</strong> <span style="color:#28a745;">PKR ${order.totalPrice?.toFixed(2) || "0.00"}</span><br>
              <strong>Payment Method:</strong> ${order.paymentMethod || "Not provided"}<br>
              <strong>Refund Date:</strong> ${new Date().toLocaleDateString()}
          </p>

          <a href="${websiteUrl}/buyer/orders" class="btn">View Your Orders</a>

          <p class="footer">
              © ${new Date().getFullYear()} SAADICollection.shop. All rights reserved.
          </p>
      </div>
  </body>
  </html>
  `
}
