const sellerRequestTemp = (
  StoreName,
  OwnerName,
  ContactEmail,
  SubmissionDate,
  ReferenceID
) => {
  const websiteUrl = process.env.WEBSITE_URL

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Store Request Confirmation</title>
  <style type="text/css">
    body, table, td, div, p, a {
      margin: 0;
      padding: 0;
      border: 0;
      font-size: 100%;
      font: inherit;
      vertical-align: baseline;
    }
          .logo {
              width: 120px;
              margin-bottom: 20px;
          }
    body {
      margin: 0;
      padding: 0;
      width: 100% !important;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      background-color: #f5f7fa;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
  </style>
</head>
<body style="background-color: #f5f7fa; padding: 20px 0;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto;">
              <img src="https://saadicollection.shop/logo.jpg" alt="saadiCollection.shop Logo" class="logo" />

    <tr>
      <td align="center" style="padding: 30px 0 20px;">
        <div style="font-size: 24px; font-weight: bold; color: #2563eb;">
          <span style="color: #2563eb; background: #dbeafe; border-radius: 6px; padding: 8px 12px; display: inline-block;">
            📦 saadiCollection
          </span>
        </div>
      </td>
    </tr>
    
    <!-- Card -->
    <tr>
      <td>
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background:#fff; border-radius:8px; box-shadow:0 2px 10px rgba(0,0,0,.05); overflow:hidden;">
          <!-- Header -->
          <tr>
            <td align="center" style="padding:40px 20px; background:linear-gradient(to right, #2563eb, #3b82f6); color:#fff;">
              <div style="font-size:32px; background:rgba(255,255,255,0.15); border-radius:50%; width:70px; height:70px; display:flex; align-items:center; justify-content:center; margin-bottom:20px;">✓</div>
              <h1 style="margin:0; font-size:26px; font-weight:700;">Store Request Received</h1>
              <p style="margin-top:10px; color:#dbeafe;">We've received your request and will process it shortly</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding:30px 40px;">
              <p style="font-size:16px; color:#334155; margin-bottom:15px;">Hello <strong style="color:#2563eb;">${OwnerName}</strong>,</p>
              <p style="font-size:16px; color:#334155; margin-bottom:15px;">Thank you for your interest in opening a store with <strong style="color:#2563eb;">ukbazaar</strong>. We've successfully received your request to open <strong style="color:#2563eb;">"${StoreName}"</strong> and our team will review it shortly.</p>
              <p style="font-size:16px; color:#334155; margin-bottom:25px;">We typically review new store requests within 2 business days. Once approved, you'll receive another email with credentials to access your store dashboard.</p>

              <!-- Details -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background:#f8fafc; border-radius:8px; border-left:4px solid #3b82f6; padding:20px;">
                <tr><td style="padding:8px 0; color:#64748b;">Store Name:</td><td style="font-weight:500; color:#1e293b;">${StoreName}</td></tr>
                <tr><td style="padding:8px 0; color:#64748b;">Owner Name:</td><td style="font-weight:500; color:#1e293b;">${OwnerName}</td></tr>
                <tr><td style="padding:8px 0; color:#64748b;">Contact Email:</td><td style="font-weight:500; color:#1e293b;">${ContactEmail}</td></tr>
                <tr><td style="padding:8px 0; color:#64748b;">Submission Date:</td><td style="font-weight:500; color:#1e293b;">${new Date(SubmissionDate).toLocaleString()}</td></tr>
                <tr><td style="padding:8px 0; color:#64748b;">Reference ID:</td><td style="font-weight:500; color:#1e293b;">${ReferenceID}</td></tr>
              </table>

              <!-- CTA -->
              <div style="text-align:center; margin-top:30px;">
                <a href=${websiteUrl} style="background:linear-gradient(to right,#2563eb,#3b82f6); color:#fff; padding:12px 28px; border-radius:6px; text-decoration:none; font-weight:600; box-shadow:0 4px 10px rgba(37,99,235,.25);">Visit Seller Center</a>
              </div>

              <p style="margin-top:20px; font-size:14px; color:#64748b; text-align:center;">Have questions? Contact our support at <a href="mailto:umairkhitab0308@gmail.com" style="color:#3b82f6; text-decoration:none;">umairkhitab0308@gmail.com</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td align="center" style="padding:20px 0; font-size:13px; color:#94a3b8;">
        © 2025 MarketPlace Inc. All rights reserved.<br>
        123 Commerce Street, San Francisco, CA 94105
      </td>
    </tr>
  </table>
</body>
</html>`;
};

export default sellerRequestTemp;
